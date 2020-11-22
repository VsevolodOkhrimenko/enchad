import './MessagingPage.scss'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import Messaging from 'components/Messaging'
import Threads from 'components/Threads'
import Navbar from 'components/Navbar'
import Settings from 'components/Settings'
import { checkIfIdExists } from 'helpers/common'
import messagingConnection, { closeWebsocketConnection } from 'utils/messaging/messagingConnection'
import { getUserInfo } from 'utils/auth/actions'


const MessagingPage = () => {
  const dispatch = useDispatch()
  const { thread_id } = useParams()
  const authToken = useSelector(state => state.auth.authToken)
  const showThreadsSidebar = useSelector(state => state.common.showThreadsSidebar)
  const showSettingsSidebar = useSelector(state => state.common.showSettingsSidebar)
  const threads = useSelector(state => state.messaging.threads)

  useEffect(() => {
      dispatch(messagingConnection(authToken))
      dispatch(getUserInfo())
      return () => {
        closeWebsocketConnection()
      }
    }, [authToken])

  return (
    <>
      <Threads />
      <div className={`content ${showThreadsSidebar ? 'threads-open' : ''} ${showSettingsSidebar ? 'settings-open' : ''}`}>
        <Navbar />
        {
          checkIfIdExists(threads, thread_id) ?
            <Messaging /> : null
        }
      </div>
      <Settings />
    </>
  )
}

export default MessagingPage
