import {
  SET_THREADS
} from 'utils/messaging/types'
import store from 'store'


export function appendThread(thread) {
  const { threads, nextThreadUrl } = store.getState().messaging

  return function action(dispatch) {
      dispatch({
        type: SET_THREADS,
        payload: {
          threads: [...[thread], ...threads],
          nextThreadUrl: nextThreadUrl
        }
      })
  }
}
