import {
  SET_KEYS,
  SET_USER_KEYS,
  SET_OPPONENT_KEY,
  SET_DECRYPTED_PRIVATE_KEY,
  SET_ENCRYPTED_PRIVATE_KEY,
  RESET_KEYS,
  SET_ENCRYPTION_ERROR,
  SET_ENCRYPTION_LOADING
} from './types'

const initialState = {
  encryptedPrivateKey: null,
  activePrivateKey: null,
  activePublicKey: null,
  activeOpponentPublicKey: null,
  encryptionError: null,
  encryptionLoading: false
}

const encryptionReducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_KEYS:
      return {
        ...state,
        activePrivateKey: action.payload.activePrivateKey,
        activePublicKey: action.payload.activePublicKey,
        activeOpponentPublicKey: action.payload.activeOpponentPublicKey
      }
    case SET_USER_KEYS:
      return {
        ...state,
        activePrivateKey: action.payload.activePrivateKey,
        activePublicKey: action.payload.activePublicKey
      }
    case SET_OPPONENT_KEY:
      return {
        ...state,
        activeOpponentPublicKey: action.payload.activeOpponentPublicKey
      }
    case SET_DECRYPTED_PRIVATE_KEY:
      return {
        ...state,
        activePrivateKey: action.payload.activePrivateKey
      }
    case SET_ENCRYPTED_PRIVATE_KEY:
      return {
        ...state,
        encryptedPrivateKey: action.payload.encryptedPrivateKey
      }
    case SET_ENCRYPTION_ERROR:
      return {
        ...state,
        encryptionError: action.payload.encryptionError
      }
    case SET_ENCRYPTION_LOADING:
      return {
        ...state,
        encryptionLoading: action.payload.encryptionLoading
      }
    case RESET_KEYS:
      return initialState
    default:
      return state
  }
}

export default encryptionReducer