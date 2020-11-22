import './Threads.scss'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  SwipeableDrawer,
  List,
  ListItem,
  Divider
} from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { resetThreads } from 'utils/messaging/actions'
import { enableThreadsSidebar, checkErrorStatus } from 'utils/common/actions'
import Thread from 'components/Thread'
import Loader from 'components/Loader'
import CreateThread from 'components/CreateThread'
import { setThreads } from './actions'
import Config from 'config'


const Threads = () => {
  const { backendUrl } = Config.network
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)
  const dispatch = useDispatch()
  const { thread_id } = useParams()
  const threads = useSelector(state => state.messaging.threads)
  const unreadsByThread = useSelector(state => state.messaging.unreadsByThread)
  const userId = useSelector(state => state.auth.userId)
  const nextThreadUrl = useSelector(state => state.messaging.nextThreadUrl)
  const showThreadsSidebar = useSelector(state => state.common.showThreadsSidebar)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      getThreads()
    }
    return () => { dispatch(resetThreads()) }
  }, [userId])

  const getThreads = (nextUrl) => {
    let url = `${backendUrl}/api/threads/`
    setError(null)
    setIsLoading(true)
    if (!nextUrl) {
      dispatch(resetThreads())
    } else {
      url = nextUrl
    }
    axios.get(url).then((body) => {
      const { data } = body
      dispatch(setThreads(data))
      setIsLoading(false)
    }).catch(error => {
      setIsLoading(false)
      if (error.response) {
        dispatch(checkErrorStatus(error.response.status))
        setError(error.response.data['detail'])
      } else {
        setError('Connection error', null)
      }
    })
  }

  const threadsListScroll = (event) => {
    const { scrollTop, scrollHeight, offsetHeight } = event.currentTarget
    const shouldScroll = scrollHeight === scrollTop + offsetHeight
    if (shouldScroll && nextThreadUrl && !isLoading) {
      dispatch(getThreads(nextThreadUrl))
    }
  }

  function renderThreads() {
    return threads.map((thread, index) => (
      <Thread
        key={index}
        id={thread["id"]}
        opponent={thread["owner"]["id"] === userId ? thread["opponent"] : thread["owner"]}
        unreadCount={unreadsByThread[thread["id"]]}
        selected={thread_id === thread["id"]}
      />
    ))
  }

  return (
    <SwipeableDrawer
      anchor="left"
      open={showThreadsSidebar}
      variant="persistent"
      onClose={() => dispatch(enableThreadsSidebar(false))}
      onOpen={() => dispatch(enableThreadsSidebar(true))}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      classes={{
        paper: 'threads-sidebar'
      }}
    >
      <List disablePadding>
        <ListItem>
          <CreateThread />
        </ListItem>
        <Divider />
        <div id="threadsList" onScroll={ threadsListScroll }>
          { isLoading ? <Loader /> : null }
          { error ? <p className="error-message">{error}</p> : null }
          {renderThreads()}
        </div>
      </List>
    </SwipeableDrawer>
  )
}

export default Threads
