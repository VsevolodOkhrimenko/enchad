import axios from 'axios'
import {
    SET_TOKEN,
    RESET_TOKEN,
    SET_USER_INFO,
    GET_USER_INFO
  } from './types'
import { checkErrorStatus, setSnackbar } from 'utils/common/actions'
import history from 'browserHistory'
import store from 'store'
import Config from 'config'

const { backendUrl } = Config.network

export function getUserInfo() {
  const { authToken }  = store.getState().auth
  return function action(dispatch) {
    if (!authToken) {
      dispatch(resetAuthToken())
    } else {
      axios.defaults.headers.common["Authorization"] = "Token ".concat(authToken)
    }
    dispatch({
      type: GET_USER_INFO,
      payload: {
        userInfoIsLoading: true,
      },
    })
    let url = `${backendUrl}/api/users/me/`
    axios.get(url).then((body) => {
      const { data } = body
      dispatch({
        type: SET_USER_INFO,
        payload: {
          userId: data['id'],
          username: data['username'],
          salt: data['user_salt'],
          userLookupId: data['user_lookup_id']
        }

      })
      localStorage.setItem('userId', data['id'])
      localStorage.setItem('username', data['username'])
      dispatch({
        type: GET_USER_INFO,
        payload: {
          userInfoIsLoading: false,
        },
      })
    }).catch(error => {
      if (error.response) {
        dispatch(checkErrorStatus(error.response.status))
        dispatch(setSnackbar(error.response.data['detail'], 'error'))
      } else {
        dispatch(setSnackbar('Connection error', 'error'))
      }
    })
  }
}

export function storeAuthToken(authToken) {
  return function action(dispatch) {
    localStorage.setItem('authToken', authToken)
    dispatch({
      type: SET_TOKEN,
      payload: {
        authToken,
      },
    })
    if (authToken) {
      axios.defaults.headers.common["Authorization"] = "Token ".concat(authToken)
      dispatch(getUserInfo())
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
  }
}

export function resetAuthToken() {
  return function action(dispatch) {
    localStorage.setItem('authToken', null)
    localStorage.setItem('userId', null)
    localStorage.setItem('username', null)
    dispatch({
      type: RESET_TOKEN,
    })
    if (history.location.pathname !== '/login') {
      history.push('/login')
    }
  }
}

export function enableAuthLoader(userInfoIsLoading) {
  return function action(dispatch) {
    dispatch({
      type: GET_USER_INFO,
      payload: {
        userInfoIsLoading: userInfoIsLoading,
      },
    })
  }
}
