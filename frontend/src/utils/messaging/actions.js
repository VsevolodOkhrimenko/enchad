import axios from 'axios'
import {
  GET_MESSAGES,
  SET_MESSAGES,
  RESET_MESSAGES,
  SET_THREADS,
  RESET_THREADS,
  UPDATE_UNREAD_COUNT
} from './types'
import { checkErrorStatus, setSnackbar } from 'utils/common/actions'
import {
  storePrivatePublicPair,
  setOpponentKey,
  setEncryptionError,
  setEncryptionLoading
} from 'utils/encryption/actions'
import {
  generatePrivateKey,
  exportPublicKey,
  exportPrivateKey,
  importPrivateKey,
  importPublicKey,
  decryptMessageArr
} from 'helpers/encryption'
import {
  moveToFirstById,
  findIndexById,
  getItemById
} from 'helpers/common'
import history from 'browserHistory'
import store from 'store'
import Config from 'config'


const { backendUrl } = Config.network


export function updateUnreadCount(count, unreadsByThread) {
  return function action(dispatch) {
    dispatch({
      type: UPDATE_UNREAD_COUNT,
      payload: {
        unreadCount: count,
        unreadsByThread: unreadsByThread
      }
    })
  }
}


export function getMessages(thread, nextUrl = null) {
  const { messages, threads } = store.getState().messaging
  const { activePrivateKey } = store.getState().encryption

  return function action(dispatch) {
    let url = `${backendUrl}/api/messages/`
    if (!nextUrl) {
      dispatch({
        type: RESET_MESSAGES
      })
    } else {
      url = nextUrl
    }
    dispatch({
      type: GET_MESSAGES
    })
    axios.get(url, {
      params: {
        thread_id: thread
      }
    }).then((body) => {
      const { data } = body
      const objDiv = document.getElementById('threadContainer')
      const prevScrollHeight = objDiv.scrollHeight
      const currentThread = getItemById(threads, thread)
      if (!nextUrl && currentThread && currentThread.public_key) {
        dispatch(setOpponentKey(currentThread.public_key))
      }
      decryptMessageArr(data.results, activePrivateKey).then(result => {
        dispatch({
          type: SET_MESSAGES,
          payload: {
            messages: [...result, ...messages],
            nextUrl: data.next
          }
        })
        if (!nextUrl) {
          objDiv.scrollTop = objDiv.scrollHeight
        } else {
          objDiv.scrollTop = objDiv.scrollHeight - prevScrollHeight
        }

        const { unreadsByThread, unreadCount } = store.getState().messaging
        const unreadsByThreadCopy = { ...unreadsByThread }
        let unreadCountCurrent = unreadCount
        if (unreadsByThreadCopy[thread]) {
          unreadCountCurrent = unreadCountCurrent - unreadsByThreadCopy[thread]
        }
        unreadsByThreadCopy[thread] = 0
        dispatch(updateUnreadCount(unreadCountCurrent, unreadsByThreadCopy))
      })
    }).catch(error => {
      if (error.response) {
        dispatch(checkErrorStatus(error.response.status))
        dispatch(setSnackbar(error.response.data.detail, 'error'))
      } else {
        dispatch(setSnackbar('Connection error', 'error'))
      }
    })
  }
}

export function incrementUnreadCountByThread(threadId) {
  const { unreadsByThread, unreadCount } = store.getState().messaging

  return function action(dispatch) {
    const unreadsByThreadCopy = { ...unreadsByThread }
    if (unreadsByThreadCopy[threadId]) {
      unreadsByThreadCopy[threadId] = unreadsByThreadCopy[threadId] + 1
    } else {
      unreadsByThreadCopy[threadId] = 1
    }
    dispatch({
      type: UPDATE_UNREAD_COUNT,
      payload: {
        unreadCount: unreadCount + 1,
        unreadsByThread: unreadsByThreadCopy
      }
    })
  }
}


export function wsAppendMessage(messageData) {
  const { nextUrl, messages, threads, nextThreadUrl } = store.getState().messaging

  return function action(dispatch) {
    const index = findIndexById(threads, messageData.thread)
    if (index === -1) {
      const url = `${backendUrl}/api/threads/${messageData.thread}/`
      axios.get(url).then((body) => {
        const { data } = body
        dispatch({
          type: SET_THREADS,
          payload: {
            threads: [...[data], ...threads],
            nextThreadUrl: nextThreadUrl
          }
        })
      }).catch(error => {
        if (error.response) {
          dispatch(checkErrorStatus(error.response.status))
          dispatch(setSnackbar(error.response.data.detail, 'error'))
        } else {
          dispatch(setSnackbar('Connection error', 'error'))
        }
      })
    } else if (index !== 0) {
      const reordered = moveToFirstById(threads, messageData.thread)
      dispatch({
        type: SET_THREADS,
        payload: {
          threads: reordered,
          nextThreadUrl: nextThreadUrl
        }
      })
    }
    if (history.location.pathname === `/${messageData.thread}`) {
      const { activePrivateKey } = store.getState().encryption
      const objDiv = document.getElementById('threadContainer')
      const shouldScroll = objDiv.scrollTop + objDiv.offsetHeight === objDiv.scrollHeight
      decryptMessageArr([messageData], activePrivateKey).then(result => {
        dispatch({
          type: SET_MESSAGES,
          payload: {
            messages: [...messages, ...result],
            nextUrl: nextUrl
          }
        })
        if (shouldScroll) {
          objDiv.scrollTop = objDiv.scrollHeight
          const urlRead = `${backendUrl}/api/messages/${messageData.id}/mark_as_read_by_id/`
          axios.post(urlRead, {}).then(() => {
          }).catch(error => {
            if (error.response) {
              dispatch(checkErrorStatus(error.response.status))
              dispatch(setSnackbar(error.response.data.detail, 'error'))
            } else {
              dispatch(setSnackbar('Connection error', 'error'))
            }
          })
        } else {
          dispatch(incrementUnreadCountByThread(messageData.thread))
        }
      })
    } else {
      dispatch(incrementUnreadCountByThread(messageData.thread))
    }
  }
}


export function wsReadMessages(data) {
  const { messages, nextUrl } = store.getState().messaging

  return function action(dispatch) {
    if (history.location.pathname === `/${data.thread}`) {
      const ids = data.messages
      for (let i = 0, length = ids.length; i < length; i = i + 1) {
        const message = document.getElementById(ids[i])
        if (message) {
          message.classList.add('read')
        }
        let index = findIndexById(messages, ids[i])
        if (index !== -1) {
          messages[index].read = true
        }
      }
      dispatch({
        type: SET_MESSAGES,
        payload: {
          messages: messages,
          nextUrl: nextUrl
        }
      })
    }
  }
}


export function resetMessages() {
  return function action(dispatch) {
    dispatch({
      type: RESET_MESSAGES
    })
  }
}


export function updateKeyPair(threadId, passphrase, privateKeyStr, callback) {
  return function action(dispatch) {
    const url = `${backendUrl}/api/threads/${threadId}/`
    let privateKeyObj
    if (privateKeyStr) {
      try {
        privateKeyObj = importPrivateKey(privateKeyStr)
      } catch (e) {
         dispatch(setEncryptionError('Error while importing Private Key'))
        return null
      }
    } else {
      privateKeyObj = generatePrivateKey()
    }
    dispatch(setEncryptionLoading(true))
    const publicKey = exportPublicKey(privateKeyObj)
    const publicKeyObj = importPublicKey(publicKey)
    const privateKey = exportPrivateKey(privateKeyObj)
    const keysDict = {
      privateKey,
      publicKey,
      privateKeyObj,
      publicKeyObj
    }
    const threadData = {
      public_key: publicKey
    }
    axios.patch(url, threadData).then(() => {
      dispatch(storePrivatePublicPair(
        passphrase,
        threadId,
        keysDict,
        () => dispatch(getMessages(threadId)))
      )
      dispatch(setEncryptionLoading(false))
      if (callback) {
        callback()
      }
    }).catch(error => {
      if (error.response) {
        dispatch(checkErrorStatus(error.response.status))
        dispatch(setSnackbar(error.response.data.detail, 'error'))
      } else {
        dispatch(setSnackbar('Connection error', 'error'))
      }
    })
  }
}


export function resetThreads() {
  return function action(dispatch) {
    dispatch({
      type: RESET_THREADS
    })
  }
}


export function wsAppendThread(threadData) {
  const { nextThreadUrl, threads, unreadsByThread, unreadCount } = store.getState().messaging

  return function action(dispatch) {
    dispatch({
      type: SET_THREADS,
      payload: {
        threads: [...[threadData], ...threads],
        nextThreadUrl: nextThreadUrl
      }
    })
    const unreadsByThreadCopy = { ...unreadsByThread }
    unreadsByThreadCopy[threadData.id] = 1
    dispatch(updateUnreadCount(unreadCount + 1, unreadsByThreadCopy))
  }
}


export function wsUpdateCurrentThread(threadData) {
  const { threads, nextThreadUrl } = store.getState().messaging
  return function action(dispatch) {
    if (history.location.pathname === `/${threadData.id}`) {
      dispatch(setOpponentKey(threadData.public_key))
    }
    for (let i = 0, length = threads.length; i < length; i = i + 1) {
      if (threads[i].id === threadData.id) {
        threads[i].public_key = threadData.public_key
      }
      dispatch({
        type: SET_THREADS,
        payload: {
          threads: threads,
          nextThreadUrl: nextThreadUrl
        }
      })
    }
  }
}

export function resetUnreadCountByThread(threadId) {
  const { unreadsByThread, unreadCount } = store.getState().messaging

  return function action(dispatch) {
    const unreadsByThreadCopy = { ...unreadsByThread }
    let unreadCountCurrent = unreadCount
    if (unreadsByThreadCopy[threadId]) {
      unreadCountCurrent = unreadCountCurrent - unreadsByThreadCopy[threadId]
    }
    unreadsByThreadCopy[threadId] = 0
    dispatch({
      type: UPDATE_UNREAD_COUNT,
      payload: {
        unreadCount: unreadCountCurrent,
        unreadsByThread: unreadsByThreadCopy
      }
    })
  }
}

export function setAsReadCurrent(threadId) {
  const { messages, nextUrl } = store.getState().messaging
  const { userId } = store.getState().auth

  return function action(dispatch) {
    const url = `${backendUrl}/api/threads/${threadId}/mark_as_read_array/`
    const messagesCopy = [...messages]
    const idsToRead = []
    for (let i = 0, length = messagesCopy.length; i < length; i = i + 1) {
      if (!messagesCopy[i].read && messagesCopy[i].sender !== userId) {
        idsToRead.push(messagesCopy[i].id)
        messagesCopy[i].read = true
      }
    }
    axios.post(url, { messages: idsToRead }).then(() => {
      dispatch({
        type: SET_MESSAGES,
        payload: {
          messages: messagesCopy,
          nextUrl: nextUrl
        }
      })
      dispatch(resetUnreadCountByThread(threadId))
    }).catch(error => {
      if (error.response) {
        dispatch(checkErrorStatus(error.response.status))
        dispatch(setSnackbar(error.response.data.detail, 'error'))
      } else {
        dispatch(setSnackbar('Connection error', 'error'))
      }
    })
  }
}
