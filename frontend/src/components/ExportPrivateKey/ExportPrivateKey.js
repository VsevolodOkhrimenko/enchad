import './ExportPrivateKey.scss'
import React, { useState } from 'react'
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@material-ui/core'
import { OpenInBrowser } from '@material-ui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { exportPrivateKey } from 'helpers/encryption'
import { setSnackbar } from 'utils/common/actions'

const ExportPrivateKey = () => {
  const dispatch = useDispatch()
  const [showDialog, setShowDialog] = useState(false)
  const [error, setError] = useState(false)
  const activePrivateKey = useSelector(state => state.encryption.activePrivateKey)
  const privateKey = exportPrivateKey(activePrivateKey)

  const copyKey = () => {
    navigator.clipboard.writeText(privateKey).then(function() {
      dispatch(setSnackbar('Copied to Clickboard'))
    }, function(err) {
      setError(`Could not copy key: ${err}`)
      dispatch(setSnackbar(`Could not copy key: ${err}`, 'error'))
    });
  }

  return (
    <>
    <ListItem button onClick={() => setShowDialog(true)} >
      <ListItemIcon><OpenInBrowser /></ListItemIcon>
      <ListItemText primary="Export my private key" />
    </ListItem>
    <Dialog
      maxWidth="md"
      fullWidth
      open={showDialog}
      onClose={() => setShowDialog(false)}
    >
      <DialogTitle>Raw Private Key</DialogTitle>
      <DialogContent>
        { error ? <p className="user-info-error">{error}</p> : null }
        <TextField
          multiline
          name="privateKey"
          label="Private key"
          rows={28}
          fullWidth
          value={ privateKey }
          InputProps={{
            readOnly: true,
          }}
        />
        <DialogActions>
          <Button variant="contained" onClick={copyKey} color="primary">
            Copy
          </Button>
          <Button variant="contained" onClick={() => setShowDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
    </>
  )}

export default ExportPrivateKey
