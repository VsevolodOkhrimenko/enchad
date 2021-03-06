import './CustomDialog.scss'
import React from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  Typography,
  DialogContent,
  DialogActions,
  Button
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { checkMobile } from 'helpers/common'
import Loader from 'components/Loader'


const CustomDialog = (props) => {
  const {
    open,
    onClose,
    isLoading,
    header,
    children,
    action,
    actionText,
    onEnter
  } = props

  const isMobile = checkMobile()

  return (
    <Dialog
      maxWidth='sm'
      fullWidth
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      onEnter={onEnter}
    >
      { isLoading ? <Loader /> : null }
      <AppBar
        position="static"
      >
        <Toolbar>
          <Typography variant="h6">
            {header}
          </Typography>
        <div style={{ flexGrow: 1 }} />
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        { children ? children : null}
        {
          action ?
            <DialogActions>
              <Button
                type='submit'
                onClick={action}
                variant='contained'
                color='primary'
              >
                { actionText ? actionText : 'Submit' }
              </Button>
              <Button variant='contained' onClick={onClose} color='primary'>
                Close
              </Button>
            </DialogActions> : null
        }
      
      </DialogContent>
    </Dialog>
  )
}


export default CustomDialog
