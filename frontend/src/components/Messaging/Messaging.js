import './Messaging.scss'
import React, { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  Button,
  DialogTitle
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  getMessages,
  resetMessages,
  setAsReadCurrent
} from 'utils/messaging/actions'
import { setEncryptedPrivateKey, resetKeys } from 'utils/encryption/actions'
import { enableKeysModal } from 'utils/common/actions'
import Message from 'components/Message'
import Loader from 'components/Loader'
import SotreKeyForm from 'components/SotreKeyForm'
import OpenKeyForm from 'components/OpenKeyForm'
import SendMessage from 'components/SendMessage'


const Messaging = (props) => {
  const dispatch = useDispatch()
  const messages = useSelector(state => state.messaging.messages)
  const unreadsByThread = useSelector(state => state.messaging.unreadsByThread)
  const nextUrl = useSelector(state => state.messaging.nextUrl)
  const activePublicKey = useSelector(state => state.encryption.activePublicKey)
  const activeOpponentPublicKey = useSelector(state => state.encryption.activeOpponentPublicKey)
  const encryptedPrivateKey = useSelector(state => state.encryption.encryptedPrivateKey)
  const isLoadingMessages = useSelector(state => state.messaging.isLoadingMessages)
  const keysModalIsVisible = useSelector(state => state.common.keysModalIsVisible)
  const userId = useSelector(state => state.auth.userId)
  const { thread_id } = useParams()

  // useEffect(() => {
  //   dispatch(setEncryptedPrivateKey(thread_id))
  //   dispatch(enableKeysModal(true))
  //   return () => {
  //     dispatch(resetMessages())
  //     dispatch(resetKeys())
  //   }
  // }, [])

  useEffect(() => {
    dispatch(resetMessages())
    dispatch(resetKeys())
    dispatch(setEncryptedPrivateKey(thread_id))
    dispatch(enableKeysModal(true))
  }, [thread_id])

  const renderMessages = () => {
    return messages.map((message, index) => (
      <Message
        key={index}
        id={message["id"]}
        text={message["text"]}
        read={message["read"]}
        senderClass={userId === message["sender"] ? 'owner' : 'opponent'}
      />
    ))
  }

  const threadScroll = (event) => {
    const { scrollTop } = event.currentTarget
    const shouldScroll = scrollTop === 0
    if (shouldScroll && nextUrl && !isLoadingMessages) {
      dispatch(getMessages(thread_id, nextUrl))
    }
    if (unreadsByThread[thread_id] && unreadsByThread[thread_id] > 0 && (scrollTop + event.currentTarget.offsetHeight === event.currentTarget.scrollHeight)) {
      dispatch(setAsReadCurrent(thread_id))
    }
  }

  const onSharePublicKeyClick = () => {
    dispatch(enableKeysModal(true))
  }


  return (
    <div className="full-height-component">
      <div
        id="threadContainer"
        className={`${activeOpponentPublicKey && activePublicKey && encryptedPrivateKey ? 'ready' : ''}`}
        onScroll={threadScroll}
      >
        { isLoadingMessages ? <Loader /> : null }

        { !isLoadingMessages && (!activeOpponentPublicKey || !activePublicKey) ?
          <div className="chat-not-initiated">
            { !activeOpponentPublicKey && activePublicKey ? <p>Target user has to share his public key</p> : null }
            { !activePublicKey ?
              <div>
                <p>You have to {encryptedPrivateKey ? 'open your private key' : 'create your key pair'}</p>
                <Button
                  onClick={onSharePublicKeyClick}
                  variant="contained"
                  color="primary"
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
      <Dialog
        open={keysModalIsVisible}
        onClose={
          () => {
            dispatch(enableKeysModal(false))
            dispatch(setEncryptedPrivateKey(thread_id))
          }
        }
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle id="dialogTitle">{encryptedPrivateKey ? 'Open key' : 'Create key'}</DialogTitle>
        <DialogContent>
          {encryptedPrivateKey ? <OpenKeyForm threadId={thread_id} /> : <SotreKeyForm threadId={thread_id} />}
        </DialogContent>
      </Dialog>
    </div> 
  )
}


export default Messaging
