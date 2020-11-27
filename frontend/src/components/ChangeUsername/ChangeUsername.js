import './ChangeUsername.scss'
import React, { useState, useReducer, useRef } from 'react'
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  InputAdornment,
  IconButton
} from '@material-ui/core'
import {
  AssignmentInd,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { enableAuthLoader } from 'utils/auth/actions'
import { checkErrorStatus, setSnackbar } from 'utils/common/actions'
import { formReducer, getFieldError } from 'helpers/forms'
import CustomDialog from 'components/CustomDialog'
import Config from 'config'

const initFormsState = {
  errors: {}
}

const ChangeUsername = () => {
  const { backendUrl } = Config.network
  const dispatch = useDispatch()
  const [formErrors, dispatchFormErrors] = useReducer(formReducer, initFormsState)
  const [showDialog, setShowDialog] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const userInfoIsLoading = useSelector(state => state.auth.userInfoIsLoading)

  const formRef = useRef()

  const changeUsernameSubmit = (event) => {
    event.preventDefault()
    const url = `${backendUrl}/api/users/change_username/`
    dispatch(enableAuthLoader(true))
    dispatchFormErrors({ type: 'reset' })
    const username = event.target.elements.username.value
    const password = event.target.elements.password.value
    const requestData = {
      username: username,
      password: password
    }
    axios.post(url, requestData).then((body) => {
      const { data } = body
      dispatch(setSnackbar(data.message))
      dispatch(enableAuthLoader(false))
      setShowDialog(false)
    }).catch(err => {
      dispatch(enableAuthLoader(false))
      if (err.response) {
        dispatch(checkErrorStatus(err.response.status))
        if (err.response.status === 400) {
          dispatchFormErrors({
            type: 'error',
            payload: err.response.data
          })
        } else {
          dispatchFormErrors({
            type: 'error',
            payload: {
              nonField: [err.response.data.detail]
            }
          })
        }
      } else {
        dispatch(setSnackbar('Connection error', 'error'))
      }
    })
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
    <ListItem button onClick={() => setShowDialog(true)} >
      <ListItemIcon><AssignmentInd /></ListItemIcon>
      <ListItemText primary='Change username' />
    </ListItem>
    <CustomDialog
      open={showDialog}
      onClose={() => setShowDialog(false)}
      header="Change username"
      isLoading={userInfoIsLoading}
      action={() => formRef.current.dispatchEvent(new Event('submit'))}
    >
      { getFieldError(formErrors, 'nonField') ?
        <p className='error-message'>{getFieldError(formErrors, 'nonField')}</p> : null }
      <form onSubmit={changeUsernameSubmit} ref={formRef} >
        <div>
          <TextField
            error={!!getFieldError(formErrors, 'username')}
            helperText={getFieldError(formErrors, 'username')}
            label='New username'
            type='text'
            name='username'
            fullWidth
          />
        </div>
        <div>
          <TextField
            error={!!getFieldError(formErrors, 'password')}
            helperText={getFieldError(formErrors, 'password')}
            label='Current password'
            type={showPassword ? 'text' : 'password'}
            name='password'
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
      </form>
    </CustomDialog>
    </>
  )
}

export default ChangeUsername
