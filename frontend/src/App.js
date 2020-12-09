import React, { useEffect } from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { Paper, Snackbar } from '@material-ui/core'
import {
  ErrorOutline,
  CheckCircleOutlineOutlined,
  WarningOutlined
} from '@material-ui/icons'
import { useSelector, useDispatch } from 'react-redux'
import Routes from 'routes'
import { closeSnackbar } from 'utils/common/actions'



const App = () => {
  const dispatch = useDispatch()
  const authToken = useSelector(state => state.auth.authToken)
  const useDarkTheme = useSelector(state => state.common.useDarkTheme)
  const snackbarMessage = useSelector(state => state.common.snackbarMessage)
  const snackbarType = useSelector(state => state.common.snackbarType)

  useEffect(()=> {
    const isMobileApp = !!window.ReactNativeWebView
    if (isMobileApp) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'theme.change',
        useDarkTheme: useDarkTheme
      }))
    }
  }, [useDarkTheme])

  const theme = createMuiTheme({
      palette: {
        type: useDarkTheme ? 'dark' : 'light'
      }
    })

  function snackbarIcon(type) {
    switch (type) {
      case 'error':
        return <ErrorOutline />
      case 'warning':
        return <WarningOutlined />
      default:
        return <CheckCircleOutlineOutlined />
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Paper className='app-wrapper' square>
      <Routes authToken={authToken} />
      <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={!!snackbarMessage}
          onClose={() => dispatch(closeSnackbar())}
        >
          <div className={`snackbar-box ${snackbarType}`}>
            {snackbarIcon(snackbarType)} {snackbarMessage}
          </div>
        </Snackbar>
      </Paper>
    </ThemeProvider>
  )
}

export default App