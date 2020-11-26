import './MessagingPage.scss'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { checkMobile } from 'helpers/common'
import Messaging from 'components/Messaging'
import EmptyThread from 'components/EmptyThread'
import Threads from 'components/Threads'
import Navbar from 'components/Navbar'
import Settings from 'components/Settings'
import messagingConnection, { closeWebsocketConnection } from 'utils/messaging/messagingConnection'
import { getUserInfo } from 'utils/auth/actions'


const MessagingPage = () => {
  const dispatch = useDispatch()
  const { thread_id } = useParams()
  const isMobile = checkMobile()
  const authToken = useSelector(state => state.auth.authToken)
  const showThreadsSidebar = useSelector(state => state.common.showThreadsSidebar)
  const showSettingsSidebar = useSelector(state => state.common.showSettingsSidebar)

  useEffect(() => {
      dispatch(messagingConnection(authToken))
      dispatch(getUserInfo())
      return () => {
        closeWebsocketConnection()
      }
    }, [authToken]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <DocumentTitle title='No chat is opened | EnChad' />
      <Threads />
      <div
        className={
          `content ${showThreadsSidebar && !isMobile ? 'threads-open' : ''}
          ${showSettingsSidebar && !isMobile ? 'settings-open' : ''}`
        }
      >
        <Navbar />
        {
          thread_id ?
            <Messaging /> : <EmptyThread />
        }
      </div>
      <Settings />
    </>
  )
}

export default MessagingPage
