import './OpenKeyForm.scss'
import {
  Button,
  TextField,
  InputAdornment,
  IconButton
} from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkMobile } from 'helpers/common'
import { enableKeysModal, enableThreadsSidebar } from 'utils/common/actions'
import { setDecryptedKeyPair, setEncryptionError } from 'utils/encryption/actions'
import { getMessages } from 'utils/messaging/actions'
import Config from 'config'


const { passwordMinSize } = Config.encryption

const OpenKeyForm = (props) => {
  const {
    threadId
  } = props

  const dispatch = useDispatch()
  const [passwordError, setPasswordError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const encryptionError = useSelector(state => state.encryption.encryptionError)
  const isMobile = checkMobile()

  useEffect(() => {
    return () => {
 dispatch(setEncryptionError(null))
}
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const openKeySubmit = (event) => {
    event.preventDefault()
    dispatch(setEncryptionError(null))
    setPasswordError(null)
    const password = event.target.elements.password.value
    if (!password) {
      setPasswordError('Password can\'t be empty')
    } else if (password.length < passwordMinSize) {
      setPasswordError(`Password minimum length: ${passwordMinSize} symbols`)
    } else {
      dispatch(
        setDecryptedKeyPair(
          threadId,
          password,
          () => dispatch(
            enableKeysModal(
              false,
              () => dispatch(getMessages(threadId))
            )
          )
        )
      )
      if (isMobile) {
        dispatch(enableThreadsSidebar(false))
      }
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className='form key-form'>
      { encryptionError ? <p className='error-message'>{encryptionError}</p> : null}
      <form onSubmit={openKeySubmit}>
        <div>
          <TextField
            error={!!passwordError || !!encryptionError}
            helperText={passwordError}
            label='Password'
            type={showPassword ? 'text' : 'password'}
            name='password'
            autoFocus={true}
            fullWidth
            InputProps={{
              endAdornment:
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword}
                    tabIndex='-1'
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
            }}
          />
        </div>
        <div className='submit-form-btn'>
          <Button
            type='submit'
            variant='contained'
            color='primary'
          >
            Open key
          </Button>
        </div>
      </form>
    </div>
  )
}

export default OpenKeyForm
