import messageSound from 'static/sounds/message.wav'
import notificationSound from 'static/sounds/notification.wav'
import {
  wsAppendMessage,
  wsReadMessages,
  wsAppendThread,
  wsUpdateCurrentThread
} from './actions'
import { setSnackbar } from 'utils/common/actions'
import Config from 'config'

const { wsUrl } = Config.network
let ws = null
let tryReconnect = true

export function closeWebsocketConnection() {
  if (ws) {
    tryReconnect = false
    ws.close()
    ws = null
  }
}

export default function messagingConnection(authToken) {
  return function action(dispatch) {
    let wsClose
    let connectionAttempts = 0
    const messageAudio = new Audio(messageSound)
    const notificationAudio = new Audio(notificationSound)
    tryReconnect = true

    notificationAudio.load()
    messageAudio.type = ' audio/wav'
    notificationAudio.load()
    notificationAudio.type = ' audio/wav'

    function playAudio(audio) {
      const playPromise = audio.play()
      if (typeof playPromise !== 'undefined') {
        playPromise.then(function () {
        }).catch(function (error) {
          console.log(error)
        })
      }
    }

    function wsOpen() {
      console.log('Connected to WebSocket server')
    }

    function wsError() {
    }

    function wsMessage(event) {
      const isMobileApp = !!window.ReactNativeWebView
      const parsed = JSON.parse(event.data)
      if (parsed.type === 'chat.message') {
        dispatch(wsAppendMessage(parsed.payload))
        if (isMobileApp) {
          window.ReactNativeWebView.postMessage(event.data)
        } else {
          playAudio(messageAudio)
        }
      } else if (parsed.type === 'chat.read') {
        dispatch(wsReadMessages(parsed.payload))
      } else if (parsed.type === 'thread.create') {
        dispatch(wsAppendThread(parsed.payload))
        if (isMobileApp) {
          window.ReactNativeWebView.postMessage(event.data)
        } else {
          playAudio(notificationAudio)
        }
      } else if (parsed.type === 'thread.update') {
        dispatch(wsUpdateCurrentThread(parsed.payload))
        if (isMobileApp) {
          window.ReactNativeWebView.postMessage(event.data)
        } else {
          playAudio(notificationAudio)
        }
      }
    }

    function connect() {
      const endpoint = `${wsUrl}/messaging/`
      const authHeader = 'Token'
      if (authToken) {
        ws = new WebSocket(endpoint, [authHeader, authToken])
        ws.onmessage = wsMessage
        ws.onopen = wsOpen
        ws.onerror = wsError
        ws.onclose = wsClose
        connectionAttempts = 0
        dispatch(setSnackbar(null))
      }
    }

    wsClose = function close() {
      connectionAttempts = connectionAttempts + 1
      if (connectionAttempts < 3 && tryReconnect) {
        console.log('Connection closed. Try to reconnect in 3 sec...')
      }
      if (connectionAttempts === 3) {
        dispatch(setSnackbar('WebSocket connectin error. Please reload the page', 'error'))
      }
      setTimeout(() => {
        connect()
      }, 3000)
    }

    connect()
  }
}
