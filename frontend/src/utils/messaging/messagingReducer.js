import {
  GET_MESSAGES,
  SET_MESSAGES,
  RESET_MESSAGES,
  SET_THREADS,
  RESET_THREADS,
  UPDATE_UNREAD_COUNT
} from './types'

const initialState = {
  messages: [],
  isLoadingMessages: false,
  nextUrl: null,
  threads: [],
  nextThreadUrl: null,
  unreadCount: 0,
  unreadsByThread: {},
  wsConnectionError: null
}

const messagingReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return {
        ...state,
        isLoadingMessages: true
      }
    case SET_MESSAGES:
      return {
        ...state,
        isSendingMessage: false,
        isLoadingMessages: false,
        messages: action.payload.messages,
        nextUrl: action.payload.nextUrl
      }
    case RESET_MESSAGES:
      return {
        ...state,
        isLoadingMessages: false,
        messages: [],
        nextUrl: null
      }
    case SET_THREADS:
      return {
        ...state,
        threads: action.payload.threads,
        nextThreadUrl: action.payload.nextThreadUrl
      }
    case RESET_THREADS:
      return {
        ...state,
        threads: [],
        nextThreadUrl: null
      }
    case UPDATE_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: action.payload.unreadCount,
        unreadsByThread: action.payload.unreadsByThread
      }
    default:
      return state
  }
}

export default messagingReducer
