import './Settings.scss'
import React from 'react'
import {
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@material-ui/core'
import {
    KeyboardArrowRight,
    ExitToApp,
    MeetingRoom,
    VpnKey
} from '@material-ui/icons'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { enableSettingsSidebar, enableKeysModal } from 'utils/common/actions'
import { resetAuthToken } from 'utils/auth/actions'
import { resetMessages } from 'utils/messaging/actions'
import { resetKeys } from 'utils/encryption/actions'
import { checkMobile } from 'helpers/common'
import ShowUserInfo from 'components/ShowUserInfo'
import ExportPrivateKey from 'components/ExportPrivateKey'
import ChangePassword from 'components/ChangePassword'
import ChangeUsername from 'components/ChangeUsername'
import history from 'browserHistory'


const Settings = () => {
  const { thread_id } = useParams()
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isMobile = checkMobile()
  const dispatch = useDispatch()
  const showSettingsSidebar = useSelector(state => state.common.showSettingsSidebar)
  const activePrivateKey = useSelector(state => state.encryption.activePrivateKey)

  return (
    <SwipeableDrawer
      anchor="right"
      open={showSettingsSidebar}
      variant={isMobile ? 'temporary' : 'persistent'}
      onClose={() => dispatch(enableSettingsSidebar(false))}
      onOpen={() => dispatch(enableSettingsSidebar(true))}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      classes={{
        paper: 'settings-sidebar'
      }}
    >
      <List>
        <ListItem button onClick={() => dispatch(enableSettingsSidebar(false))}>
          <ListItemIcon><KeyboardArrowRight /></ListItemIcon>
        </ListItem>
        <Divider />
        <ShowUserInfo />
        { thread_id ?
          <div>
            { activePrivateKey ? <ExportPrivateKey /> : null}
            <ListItem
              button
              onClick={
                () => {
                  dispatch(resetMessages())
                  dispatch(resetKeys())
                  history.push('/')
                }
              }
            >
              <ListItemIcon><MeetingRoom /></ListItemIcon>
              <ListItemText primary="Exit this chat" />
            </ListItem>
            <ListItem
              button
              onClick={
                () => {
                  dispatch(resetMessages())
                  dispatch(resetKeys())
                  dispatch(enableKeysModal(true))
                }
              }
            >
              <ListItemIcon><VpnKey /></ListItemIcon>
              <ListItemText primary="Set new key pair" />
            </ListItem>
          </div>
        : null }
        <ChangeUsername />
        <ChangePassword />
        <ListItem button onClick={() => dispatch(resetAuthToken())}>
          <ListItemIcon><ExitToApp /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </SwipeableDrawer>
  )}

export default Settings