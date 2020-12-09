import './CreateThread.scss'
import {
  TextField,
  InputAdornment,
  IconButton
} from '@material-ui/core'
import { PersonAdd } from '@material-ui/icons'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Loader from 'components/Loader'
import { checkErrorStatus } from 'utils/common/actions'
import { appendThread } from './actions'
import Config from 'config'
import history from 'browserHistory'

const CreateThread = () => {
  const dispatch = useDispatch()
  const { backendUrl } = Config.network
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const createThread = (targetUserId) => {
    const url = `${backendUrl}/api/threads/`
    const threadData = {
      opponent: targetUserId
    }
    setError(null)
    setIsLoading(true)
    axios.post(url, threadData).then((body) => {
      const { data } = body
      dispatch(appendThread(data))
      setIsLoading(false)
    }).catch(err => {
      setIsLoading(false)
      if (err.response) {
        dispatch(checkErrorStatus(err.response.status))
        if (err.response.status === 302) {
          setError(null)
          history.push(err.response.data.id)
        } else {
          setError(err.response.data.detail)
        }
      } else {
        setError('Connection error')
      }
    })
  }

  const createThreadSubmit = (event) => {
    event.preventDefault()
    const targetUserId = event.target.elements.user.value
    createThread(targetUserId)
    event.target.elements.user.value = ''
  }

  const onEnterPress = (event) => {
    if (event.keyCode === 13 && event.shiftKey === false && event.ctrlKey === false) {
      event.preventDefault()
      const targetUserId = event.target.value
      if (targetUserId) {
        createThread(targetUserId)
        event.target.value = ''
      }
    }
  }

  return (
    <form id='createThread' onSubmit={ isLoading ? null : createThreadSubmit } >
      { isLoading ? <Loader /> : null }
        <TextField
          error={!!error}
          helperText={error}
          fullWidth
          autoComplete='off'
          label='Create thread'
          type='text'
          name='user'
          onKeyDown={ isLoading ? null : onEnterPress }
          InputProps={{
            endAdornment:
              <InputAdornment position='end'>
                <IconButton
                  aria-label='create thread'
                  type='submit'
                >
                  <PersonAdd />
                </IconButton>
              </InputAdornment>
          }}
        />
    </form>
  )
}

export default CreateThread
