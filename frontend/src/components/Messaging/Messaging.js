import './Messaging.scss'
import React, { useEffect } from 'react'
import { Button } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import DocumentTitle from 'react-document-title'
import { getItemById } from 'helpers/common'
import {
  getMessages,
  resetMessages,
  setAsReadCurrent
} from 'utils/messaging/actions'
import { setEncryptedPrivateKey, resetKeys } from 'utils/encryption/actions'
import { enableKeysModal } from 'utils/common/actions'
import Message from 'components/Message'
import CustomDialog from 'components/CustomDialog'
import Loader from 'components/Loader'
import SotreKeyForm from 'components/SotreKeyForm'
import OpenKeyForm from 'components/OpenKeyForm'
import SendMessage from 'components/SendMessage'


const Messaging = () => {
  const dispatch = useDispatch()
  const { thread_id } = useParams()
  const messages = useSelector(state => state.messaging.messages)
  const threads = useSelector(state => state.messaging.threads)
  const unreadsByThread = useSelector(state => state.messaging.unreadsByThread)
  const nextUrl = useSelector(state => state.messaging.nextUrl)
  const activePublicKey = useSelector(state => state.encryption.activePublicKey)
  const activeOpponentPublicKey = useSelector(state => state.encryption.activeOpponentPublicKey)
  const encryptedPrivateKey = useSelector(state => state.encryption.encryptedPrivateKey)
  const isLoadingMessages = useSelector(state => state.messaging.isLoadingMessages)
  const keysModalIsVisible = useSelector(state => state.common.keysModalIsVisible)
  const userId = useSelector(state => state.auth.userId)


  useEffect(() => {
    dispatch(resetMessages())
    dispatch(resetKeys())
    dispatch(setEncryptedPrivateKey(thread_id))
    dispatch(enableKeysModal(true))
  }, [thread_id, userId]) // eslint-disable-line react-hooks/exhaustive-deps

  const renderMessages = () => {
    return messages.map((message, index) => (
      <Message
        key={index}
        id={message.id}
        text={message.text}
        read={message.read}
        senderClass={userId === message.sender ? 'owner' : 'opponent'}
      />
    ))
  }

  const threadScroll = (event) => {
    const { scrollTop } = event.currentTarget
    const shouldScroll = scrollTop === 0
    if (shouldScroll && nextUrl && !isLoadingMessages) {
      dispatch(getMessages(thread_id, nextUrl))
    }
    if (unreadsByThread[thread_id] && unreadsByThread[thread_id] > 0 &&
        (scrollTop + event.currentTarget.offsetHeight === event.currentTarget.scrollHeight)) {
      dispatch(setAsReadCurrent(thread_id))
    }
  }

  const onSharePublicKeyClick = () => {
    dispatch(enableKeysModal(true))
  }

  const getOpponentUsername = () => {
    const activeThread = getItemById(threads, thread_id)
    if (activeThread) {
      return activeThread.opponent.id === userId ?
        activeThread.owner.username : activeThread.opponent.username
    }
    return ''
  }

  getOpponentUsername()


  return (
    <div className='full-height-component'>
      <DocumentTitle title={`Chat with ${getOpponentUsername()} | EnChad`} />
      <div
        id='threadContainer'
        className={
          `${activeOpponentPublicKey && activePublicKey && encryptedPrivateKey ? 'ready' : ''}`}
        onScroll={threadScroll}
      >
        { isLoadingMessages && <Loader /> }

        { !isLoadingMessages && (!activeOpponentPublicKey || !activePublicKey) ?
          <div className='chat-not-initiated'>
            { !activeOpponentPublicKey && activePublicKey ?
              <p>Target user has to share his public key</p> : null }
            { !activePublicKey ?
              <div>
                <p>You have to {encryptedPrivateKey ?
                  'open your private key' : 'create your key pair'}</p>
                <Button
                  onClick={onSharePublicKeyClick}
                  variant='contained'
                  color='primary'
                >
                  {encryptedPrivateKey ? 'Open key' : 'Create key pair'}

                </Button>
              </div> : null
            }
          </div> : null
        }
        { activeOpponentPublicKey && activePublicKey ? renderMessages() : null }
      </div>
      {activeOpponentPublicKey && activePublicKey ?
        <SendMessage /> : null
      }
      <CustomDialog
        open={keysModalIsVisible}
        onClose={
          () => {
            dispatch(enableKeysModal(false))
            dispatch(setEncryptedPrivateKey(thread_id))
          }
        }
        header={encryptedPrivateKey ? 'Open key' : 'Create key'}
      >
        {encryptedPrivateKey ?
          <OpenKeyForm threadId={thread_id} /> : <SotreKeyForm threadId={thread_id} />}
      </CustomDialog>
    </div>
  )
}


export default Messaging
