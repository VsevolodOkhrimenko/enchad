import './ShowUserInfo.scss'
import React, { useState } from 'react'
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core'
import { PersonPin } from '@material-ui/icons'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getUserInfo, enableAuthLoader } from 'utils/auth/actions'
import { checkErrorStatus, setSnackbar } from 'utils/common/actions'
import Loader from 'components/Loader'
import Config from 'config'

const ShowUserInfo = () => {
  const { backendUrl } = Config.network
  const dispatch = useDispatch()
  const [showDialog, setShowDialog] = useState(false)
  const userLookupId = useSelector(state => state.auth.userLookupId)
  const username = useSelector(state => state.auth.username)
  const userInfoIsLoading = useSelector(state => state.auth.userInfoIsLoading)

  const resetLookupId = () => {
    const url = `${backendUrl}/api/users/reset_lookup_id/`
    dispatch(enableAuthLoader(true))
    axios.post(url, {}).then((body) => {
      const { data } = body
      dispatch(getUserInfo())
      dispatch(setSnackbar(data['message']))
    }).catch(error => {
      dispatch(enableAuthLoader(false))
      if (error.response) {
        dispatch(checkErrorStatus(error.response.status))
        dispatch(setSnackbar(error.response.data['detail'], 'error'))
      } else {
        dispatch(setSnackbar('Connection error', 'error'))
      }
    })
  }

  return (
    <>
    <ListItem button onClick={() => setShowDialog(true)} >
      <ListItemIcon><PersonPin /></ListItemIcon>
      <ListItemText primary="Show my user info" />
    </ListItem>
    <Dialog
      maxWidth="sm"
      fullWidth
      open={showDialog}
      onClose={() => setShowDialog(false)}
      onEnter={() => dispatch(getUserInfo())}
    >
      { userInfoIsLoading ? <Loader /> : null }
      <DialogTitle>User Info</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Username: {username}
        </DialogContentText>
        <DialogContentText>
          User Lookup Id: {userLookupId} <Button onClick={resetLookupId} color="primary">Reset</Button>
        </DialogContentText>
        <DialogActions>
          <Button variant="contained" onClick={() => setShowDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
    </>
  )}

export default ShowUserInfo