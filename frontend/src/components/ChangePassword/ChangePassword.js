import './ChangePassword.scss'
import React, { useState, useReducer, useRef } from 'react'
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  InputAdornment,
  IconButton
} from '@material-ui/core'
import {
  Lock,
  Visibility,
  VisibilityOff
} from '@material-ui/icons'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { enableAuthLoader } from 'utils/auth/actions'
import { checkErrorStatus, setSnackbar } from 'utils/common/actions'
import { formReducer, getFieldError } from 'helpers/forms'
import Loader from 'components/Loader'
import Config from 'config'

const initFormsState = {
  errors: {}
}

const ChangePassword = () => {
  const { backendUrl } = Config.network
  const dispatch = useDispatch()
  const [formErrors, dispatchFormErrors] = useReducer(formReducer, initFormsState)
  const [showDialog, setShowDialog] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showNewPassword2, setShowNewPassword2] = useState(false)
  const userInfoIsLoading = useSelector(state => state.auth.userInfoIsLoading)

  const formRef = useRef()

  const changePasswordSubmit = (event) => {
    event.preventDefault()
    const url = `${backendUrl}/api/users/change_password/`
    dispatch(enableAuthLoader(true))
    dispatchFormErrors({ type: 'reset'})
    const oldPassword = event.target.elements.password.value
    const password1 = event.target.elements.new_password.value
    const password2 = event.target.elements.new_password2.value
    const requestData = {
      'password': oldPassword,
      'new_password': password1,
      'new_password2': password2
    }
    axios.post(url, requestData).then((body) => {
      const { data } = body
      dispatch(setSnackbar(data['message']))
      dispatch(enableAuthLoader(false))
      setShowDialog(false)
    }).catch(error => {
      dispatch(enableAuthLoader(false))
      if (error.response) {
        dispatch(checkErrorStatus(error.response.status))
        if (error.response.status === 400) {
          dispatchFormErrors({
            type: 'error',
            payload: error.response.data
          })
        } else {
          dispatchFormErrors({
            type: 'error',
            payload: {
              'nonField': [error.response.data['detail']]
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

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword)
  }

  const handleClickShowNewPassword2 = () => {
    setShowNewPassword2(!showNewPassword2)
  }

  return (
    <>
    <ListItem button onClick={() => setShowDialog(true)} >
      <ListItemIcon><Lock /></ListItemIcon>
      <ListItemText primary="Change user password" />
    </ListItem>
    <Dialog
      maxWidth="sm"
      fullWidth
      open={showDialog}
      onClose={() => setShowDialog(false)}
    >
      { userInfoIsLoading ? <Loader /> : null }
      <DialogTitle>Change password</DialogTitle>
      <DialogContent>
        { getFieldError(formErrors, 'nonField') ? <p className="error-message">{getFieldError(formErrors, 'nonField')}</p> : null }
        <form onSubmit={changePasswordSubmit} ref={formRef} >
          <div>
            <TextField
              error={!!getFieldError(formErrors, 'password')}
              helperText={getFieldError(formErrors, 'password')}
              label="Current password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              fullWidth
              InputProps={{
                endAdornment: 
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      tabIndex='-1'
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
              }}
            />
          </div>
          <div>
            <TextField
              error={!!getFieldError(formErrors, 'new_password')}
              helperText={getFieldError(formErrors, 'new_password')}
              label="New password"
              type={showNewPassword ? 'text' : 'password'}
              name="new_password"
              fullWidth
              InputProps={{
                endAdornment: 
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowNewPassword}
                      tabIndex='-1'
                    >
                      {showNewPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
              }}
            />
          </div>
          <div>
            <TextField
              error={!!getFieldError(formErrors, 'new_password2')}
              helperText={getFieldError(formErrors, 'new_password2')}
              label="Confirm new password"
              type={showNewPassword2 ? 'text' : 'password'}
              name="new_password2"
              fullWidth
              InputProps={{
                endAdornment: 
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowNewPassword2}
                      tabIndex='-1'
                    >
                      {showNewPassword2 ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
              }}
            />
          </div>
        </form>
        <DialogActions>
          <Button
            type="submit"
            onClick={() => formRef.current.dispatchEvent(new Event('submit'))}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
          <Button variant="contained" onClick={() => setShowDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
    </>
  )}

export default ChangePassword
