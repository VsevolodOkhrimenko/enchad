import {
  SET_THREADS
} from 'utils/messaging/types'
import { updateUnreadCount } from 'utils/messaging/actions'
import store from 'store'

function arrayToUnreadsDict(threads) {
  const unreadDict = {}
  for (let i = 0, length = threads.length; i < length; i += 1) {
    unreadDict[threads[i]['id']] = threads[i]['unread_count']
  }
  return unreadDict
}

export function setThreads(threadsData) {
  const { threads } = store.getState().messaging

  return function action(dispatch) {
    dispatch({
      type: SET_THREADS,
      payload: {
        threads: [...threadsData['results'], ...threads],
        nextThreadUrl: threadsData['next']
      }
    })

    dispatch(updateUnreadCount(threadsData['unread_count'], arrayToUnreadsDict(threadsData['results'])))
  }
}
