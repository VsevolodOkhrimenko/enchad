import { SET_MESSAGES, SET_THREADS } from 'utils/messaging/types'
import { decryptMessageArr } from 'helpers/encryption'
import {
  moveToFirstById,
  findIndexById } from 'helpers/common'
import store from 'store'


export function appendMessage(message) {
  const { nextUrl, messages, threads, nextThreadUrl } = store.getState().messaging
  const { activePrivateKey } = store.getState().encryption
  return function action(dispatch) {
    decryptMessageArr([message], activePrivateKey).then(result => {
      dispatch({
        type: SET_MESSAGES,
        payload: {
          messages: [...messages, ...result],
          nextUrl: nextUrl
        }
      })
      const index = findIndexById(threads, message["thread"])
      if (index !== 0) {
        const reordered = moveToFirstById(threads, message["thread"])
        dispatch({
          type: SET_THREADS,
          payload: {
            threads: reordered,
            nextThreadUrl: nextThreadUrl
          }
        })
      }
      const objDiv = document.getElementById('threadContainer')
      objDiv.scrollTop = objDiv.scrollHeight
    })
  }
}
