import {
    SET_TOKEN,
    RESET_TOKEN,
    SET_USER_INFO,
    GET_USER_INFO,
    GET_USER_INFO_ERROR
  } from './types'

const initialState = {
  authToken: localStorage.getItem('authToken'),
  userId: null,
  username: null,
  userLookupId: null,
  userSecret: null,
  userInfoIsLoading: false,
  getUserInfoError: null
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        authToken: action.payload.authToken
      }
    case GET_USER_INFO:
      return {
        ...state,
        userInfoIsLoading: action.payload.userInfoIsLoading,
        getUserInfoError: null
      }
    case SET_USER_INFO:
      return {
        ...state,
        getUserInfoError: null,
        userId: action.payload.userId,
        username: action.payload.username,
        userSecret: action.payload.userSecret,
        userLookupId: action.payload.userLookupId
      }
    case GET_USER_INFO_ERROR:
      return {
        ...state,
        userInfoIsLoading: false,
        getUserInfoError: action.payload.getUserInfoError
      }
    case RESET_TOKEN:
      return initialState
    default:
      return state
  }
}

export default authReducer
