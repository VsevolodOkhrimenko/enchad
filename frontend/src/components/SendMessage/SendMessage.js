import './SendMessage.scss'
import axios from 'axios'
import React, { useState } from 'react'
import {
  TextField,
  InputAdornment,
  IconButton
} from '@material-ui/core'
import { Send } from '@material-ui/icons'
import { encrypt } from 'helpers/encryption'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { checkErrorStatus } from 'utils/common/actions'
import { appendMessage } from './actions'
import Loader from 'components/Loader'
import Config from 'config'


const SendMessage = () => {
  const { thread_id } = useParams()
  const dispatch = useDispatch()
  const { backendUrl } = Config.network
  const activePublicKey = useSelector(state => state.encryption.activePublicKey)
  const activeOpponentPublicKey = useSelector(state => state.encryption.activeOpponentPublicKey)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendMessage = (message) => {
    setIsLoading(true)
    const url = `${backendUrl}/api/messages/`
    const encryptedMessageData = {
      threadID: thread_id,
      self_encrypted: {
        text: encrypt(message, activePublicKey)
      },
      target_encrypted: {
        text: encrypt(message, activeOpponentPublicKey)
      }
    }
    axios.post(url, encryptedMessageData).then((body) => {
      const { data } = body
      setIsLoading(false)
      dispatch(appendMessage(data))
    }).catch(err => {
      setIsLoading(false)
      if (err.response) {
        dispatch(checkErrorStatus(err.response.status))
        setError(err.response.data.detail)
      } else {
        setError('Something went wrong...', null)
      }
    })
  }


  const sendMessageSubmit = (event) => {
    event.preventDefault()
    const message = event.target.elements.message.value.trim()
    if (message) {
      sendMessage(message)
    }
    event.target.elements.message.value = ''
  }

  const onEnterPress = (event) => {
    if (event.keyCode === 13 && event.shiftKey === false && event.ctrlKey === false) {
      event.preventDefault()
      const message = event.target.value.trim()
      if (message) {
        sendMessage(message)
      }
      event.target.value = ''
    }
  }

  return (
    <form id='messagesForm' onSubmit={ isLoading ? null : sendMessageSubmit } >
      { isLoading ?
        <Loader /> : null
      }
      <TextField
        error={!!error}
        helperText={error}
        multiline
        fullWidth
        autoFocus={true}
        id='messageTextInput'
        rows={2}
        variant='outlined'
        name='message'
        onKeyDown={ isLoading ? null : onEnterPress }
        InputProps={{
          endAdornment:
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                type='submit'
                color='primary'
              >
                <Send variant='rounded' />
              </IconButton>
            </InputAdornment>
        }}
      />
    </form>
  )
}

export default SendMessage
