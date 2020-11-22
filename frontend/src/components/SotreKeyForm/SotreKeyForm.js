import './SotreKeyForm.scss'
import {
  Button,
  TextField,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  IconButton
} from '@material-ui/core'
import { ExpandMore, Visibility, VisibilityOff } from '@material-ui/icons'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkMobile } from 'helpers/common'
import { enableKeysModal, enableThreadsSidebar } from 'utils/common/actions'
import { updateKeyPair } from 'utils/messaging/actions'
import Loader from 'components/Loader'
import Config from 'config'


const { passwordMinSize } = Config.encryption

const SotreKeyForm = (props) => {
  const {
    threadId
  } = props

  const dispatch = useDispatch()
  const isMobile = checkMobile()
  const encryptionError = useSelector(state => state.encryption.encryptionError)
  const encryptionLoading = useSelector(state => state.encryption.encryptionLoading)
  const [passwordError, setPasswordError] = useState(null)
  const [showPassword1, setShowPassword1] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  const storeKeySubmit = (event) => {
    event.preventDefault()
    const privateKey = event.target.elements.privateKey.value
    const password1 = event.target.elements.password1.value
    const password2 = event.target.elements.password2.value
    if (password1 !== password2) {
      setPasswordError('Passwords are not equal')
    } else if (!password1) {
      setPasswordError('Password can\'t be empty')
    } else if (password1.length < passwordMinSize) {
      setPasswordError(`Password minimum length: ${passwordMinSize} symbols`)
    } else {
      dispatch(updateKeyPair(
        threadId,
        password1,
        privateKey,
        () => dispatch(enableKeysModal(
          false,
          isMobile ? () => dispatch(enableThreadsSidebar(false)) : null))))
    }
  }

  const handleClickShowPassword1 = () => {
    setShowPassword1(!showPassword1)
  }

  const handleClickShowPassword2 = () => {
    setShowPassword2(!showPassword2)
  }

  return (
    <div className="form key-form">
      { encryptionLoading ? <Loader /> : null }
      { encryptionError ? <p className="error-message">{encryptionError}</p> : null}
      <form onSubmit={storeKeySubmit}>
        <div className="private-key-accordion">
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
            >
              <Typography>Import my raw Private Key</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                multiline
                name="privateKey"
                label="Raw RSA PKCS8 Private Key"
                rows={28}
                helperText="Leave empty to generate new key"
              />
            </AccordionDetails>
          </Accordion>
        </div>
        <div>
          <TextField
            fullWidth
            autoFocus={true}
            label="Create password"
            type="password"
            name="password1"
            InputProps={{
              endAdornment: 
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword1}
                    tabIndex='-1'
                  >
                    {showPassword1 ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
            }}
          />
        </div>
        <div>
          <TextField
            fullWidth
            error={!!passwordError}
            helperText={passwordError}
            label="Confirm password"
            type="password"
            name="password2"
            InputProps={{
              endAdornment: 
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword2}
                    tabIndex='-1'
                  >
                    {showPassword2 ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
            }}
          />
        </div>
        <div className="submit-form-btn">
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Store key
          </Button>
        </div>
      </form>
    </div>
  )}

export default SotreKeyForm
