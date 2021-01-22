import React, { useState } from 'react'
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  DialogContentText
} from '@material-ui/core'
import { PersonPin } from '@material-ui/icons'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getUserInfo, enableAuthLoader } from 'utils/auth/actions'
import { checkErrorStatus, setSnackbar } from 'utils/common/actions'
import CustomDialog from 'components/CustomDialog'
import Config from 'config'
// import useStyles from './styles'

const ShowUserInfo = () => {
  const { backendUrl } = Config.network
  const dispatch = useDispatch()
  // const classes = useStyles()
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
      dispatch(setSnackbar(data.message))
    }).catch(error => {
      dispatch(enableAuthLoader(false))
      if (error.response) {
        dispatch(checkErrorStatus(error.response.status))
        dispatch(setSnackbar(error.response.data.detail, 'error'))
      } else {
        dispatch(setSnackbar('Connection error', 'error'))
      }
    })
  }

  return (
    <>
    <ListItem divider button onClick={() => setShowDialog(true)} >
      <ListItemIcon><PersonPin /></ListItemIcon>
      <ListItemText primary='Show my user info' />
    </ListItem>
    <CustomDialog
      header='User Info'
      open={showDialog}
      onClose={() => setShowDialog(false)}
      onEnter={() => dispatch(getUserInfo())}
      isLoading={userInfoIsLoading}
      action={resetLookupId}
      actionText='Reset Search ID'
    >
        <DialogContentText>
          Username: {username}
        </DialogContentText>
        <DialogContentText>
          User Lookup Id: {userLookupId}
        </DialogContentText>
    </CustomDialog>
    </>
  )
}

export default ShowUserInfo
