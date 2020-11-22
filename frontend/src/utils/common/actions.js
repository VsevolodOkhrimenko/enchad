import {
  ENABLE_KEYS_MODAL,
  ENABLE_THREADS_SIDEBAR,
  ENABLE_SETTINGS_SIDEBAR,
  ENABLE_DARK_THEME,
  SET_SNACKBAR,
  CLOSE_SNACKBAR
} from './types'
import { resetAuthToken } from 'utils/auth/actions'


export function checkErrorStatus(code) {
  return function action(dispatch) {
    if (code === 401) {
      dispatch(setSnackbar('Auth token is expired', 'error'))
      dispatch(resetAuthToken())
    }
  }
}

export function setSnackbar(message, type='success') {
  return function action(dispatch) {
    dispatch({
      type: SET_SNACKBAR,
      payload: {
        message: message,
        type: type
      }
    })
  }
}

export function closeSnackbar() {
  return function action(dispatch) {
    dispatch({
      type: CLOSE_SNACKBAR
    })
  }
}


export function enableKeysModal(keysModalIsVisible, callback) {
  return function action(dispatch) {
    dispatch({
      type: ENABLE_KEYS_MODAL,
      payload: {
        keysModalIsVisible: keysModalIsVisible
      }
    })
    if (callback) {
      callback()
    }
  }
}

export function enableThreadsSidebar(showThreadsSidebar, callback) {
  return function action(dispatch) {
    dispatch({
      type: ENABLE_THREADS_SIDEBAR,
      payload: {
        showThreadsSidebar: showThreadsSidebar
      }
    })
    if (callback) {
      callback()
    }
  }
}

export function enableSettingsSidebar(showSettingsSidebar, callback) {
  return function action(dispatch) {
    dispatch({
      type: ENABLE_SETTINGS_SIDEBAR,
      payload: {
        showSettingsSidebar: showSettingsSidebar
      }
    })
    if (callback) {
      callback()
    }
  }
}

export function enableDarkTheme(useDarkTheme, callback) {
  return function action(dispatch) {
    dispatch({
      type: ENABLE_DARK_THEME,
      payload: {
        useDarkTheme: useDarkTheme
      }
    })
    localStorage.setItem('useDarkTheme', useDarkTheme)
    if (callback) {
      callback()
    }
  }
}
