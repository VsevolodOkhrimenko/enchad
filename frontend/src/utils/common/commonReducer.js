import {
  ENABLE_KEYS_MODAL,
  ENABLE_THREADS_SIDEBAR,
  ENABLE_SETTINGS_SIDEBAR,
  ENABLE_DARK_THEME,
  SET_SNACKBAR,
  CLOSE_SNACKBAR
} from './types'

const initialState = {
  error: null,
  showThreadsSidebar: true,
  showSettingsSidebar: false,
  keysModalIsVisible: false,
  useDarkTheme: JSON.parse(localStorage.getItem('useDarkTheme')),
  snackbarMessage: null,
  snackbarType: 'success'
}

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SNACKBAR:
      return {
        ...state,
        snackbarMessage: action.payload.message,
        snackbarType: action.payload.type
      }
    case CLOSE_SNACKBAR:
      return {
        ...state,
        snackbarMessage: null
      }
    case ENABLE_KEYS_MODAL:
      return {
        ...state,
        keysModalIsVisible: action.payload.keysModalIsVisible
      }
    case ENABLE_THREADS_SIDEBAR:
      return {
        ...state,
        showThreadsSidebar: action.payload.showThreadsSidebar
      }
    case ENABLE_SETTINGS_SIDEBAR:
      return {
        ...state,
        showSettingsSidebar: action.payload.showSettingsSidebar
      }
    case ENABLE_DARK_THEME:
      return {
        ...state,
        useDarkTheme: action.payload.useDarkTheme
      }
    default:
      return state
  }
}

export default commonReducer
