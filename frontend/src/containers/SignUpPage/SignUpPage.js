import axios from 'axios'
import React, { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Container,
  AppBar,
  Toolbar
} from '@material-ui/core'
import {
  Visibility,
  VisibilityOff,
  Brightness7,
  Brightness4
} from '@material-ui/icons'
import { useDispatch, useSelector } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { enableDarkTheme } from 'utils/common/actions'
import Loader from 'components/Loader'
import history from 'browserHistory'
import { storeAuthToken, resetAuthToken } from 'utils/auth/actions'
import Config from 'config'
import useStyles from './styles'

const { backendUrl } = Config.network

const SignUpPage = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const useDarkTheme = useSelector(state => state.common.useDarkTheme)
  const [loginError, setLoginError] = useState(null)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    dispatch(resetAuthToken())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function loginSubmit(event) {
    event.preventDefault()
    const username = event.target.elements.username.value
    const password = event.target.elements.password.value
    const stayLoggedIn = event.target.elements.stayLoggedIn.checked
    const url = `${backendUrl}/auth-token/`
    const authData = {
      username,
      password
    }
    delete axios.defaults.headers.common.Authorization
    setError(null)
    setLoginError(null)
    setIsLoading(true)
    axios.post(url, authData).then((body) => {
      dispatch(storeAuthToken(body.data.token, stayLoggedIn))
      setIsLoading(false)
      history.push('')
    }).catch(err => {
      setIsLoading(false)
      if (err.response) {
        setLoginError('Invalid credentials')
      } else {
        setError('Connection error')
      }
    })
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      <DocumentTitle title='Login | EnChad' />
      <AppBar position='static' className='navbar'>
        <Toolbar>
          <div style={{ flexGrow: 1 }} />
            <IconButton
              color='inherit'
              aria-label='theme'
              onClick={() => dispatch(enableDarkTheme(!useDarkTheme))}
            >
              { useDarkTheme ? <Brightness4 /> : <Brightness7 /> }
            </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.loginContainer}>
        <Container maxWidth='sm' className={classes.loginInnerContainer}>
          { isLoading ? <Loader /> : null }
          <form onSubmit={loginSubmit}>
            { error ? <p className='error-message'>{error}</p> : null }
            <div className={classes.fieldWrapper}>
              <TextField
                variant='filled'
                label='Username'
                type='text'
                name='username'
                autoFocus={true}
                fullWidth
              />
            </div>
            <div className={classes.fieldWrapper}>
              <TextField
                variant='filled'
                error={!!loginError}
                helperText={loginError}
                label='Password'
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
            <FormControlLabel
              control={
                <Checkbox
                  name='stayLoggedIn'
                  color='primary'
                />
              }
              label='Remember me'
            />
            <div className={classes.submitFormBtn}>
              <Button
                type='submit'
                variant='contained'
                color='primary'
              >
                Login
              </Button>
            </div>
          </form>
        </Container>
      </div>
    </>
  )
}

export default SignUpPage
