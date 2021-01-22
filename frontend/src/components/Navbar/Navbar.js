import {
  IconButton,
  AppBar,
  Toolbar,
  Badge
} from '@material-ui/core'
import {
  Menu,
  MenuOpen,
  Settings,
  Brightness4,
  Brightness7
} from '@material-ui/icons'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  enableThreadsSidebar,
  enableSettingsSidebar,
  enableDarkTheme
} from 'utils/common/actions'
// import useStyles from './styles'

const Navbar = () => {
  const dispatch = useDispatch()
  // const classes = useStyles()
  const showThreadsSidebar = useSelector(state => state.common.showThreadsSidebar)
  const showSettingsSidebar = useSelector(state => state.common.showSettingsSidebar)
  const unreadCount = useSelector(state => state.messaging.unreadCount)
  const useDarkTheme = useSelector(state => state.common.useDarkTheme)

  return (
    <AppBar position='static' className='navbar'>
      <Toolbar>
        <IconButton
          onClick={() => dispatch(enableThreadsSidebar(!showThreadsSidebar))}
          edge='start'
          color='inherit'
          aria-label='back'
        >
          <Badge badgeContent={unreadCount} color='secondary'>
            { showThreadsSidebar ?
              <MenuOpen /> : <Menu />
            }
          </Badge>
        </IconButton>
        <div style={{ flexGrow: 1 }} />
          <IconButton
            color='inherit'
            aria-label='theme'
            onClick={() => dispatch(enableDarkTheme(!useDarkTheme))}
          >
            { useDarkTheme ? <Brightness7 /> : <Brightness4 /> }
          </IconButton>
          <IconButton
            color='inherit'
            aria-label='settings'
            onClick={() => dispatch(enableSettingsSidebar(!showSettingsSidebar))}
          >
            <Settings />
          </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
