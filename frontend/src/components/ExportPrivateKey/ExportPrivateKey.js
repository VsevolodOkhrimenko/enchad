import React, { useState } from 'react'
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField
} from '@material-ui/core'
import { OpenInBrowser } from '@material-ui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { exportPrivateKey } from 'helpers/encryption'
import { setSnackbar } from 'utils/common/actions'
import CustomDialog from 'components/CustomDialog'
// import useStyles from './styles'

const ExportPrivateKey = () => {
  const dispatch = useDispatch()
  // const classes = useStyles()
  const [showDialog, setShowDialog] = useState(false)
  const [error, setError] = useState(false)
  const activePrivateKey = useSelector(state => state.encryption.activePrivateKey)
  const privateKey = exportPrivateKey(activePrivateKey)

  const copyKey = () => {
    navigator.clipboard.writeText(privateKey).then(function () {
      dispatch(setSnackbar('Copied to Clickboard'))
    }, function (err) {
      setError(`Could not copy key: ${err}`)
      dispatch(setSnackbar(`Could not copy key: ${err}`, 'error'))
    })
  }

  return (
    <>
    <ListItem button onClick={() => setShowDialog(true)} >
      <ListItemIcon><OpenInBrowser /></ListItemIcon>
      <ListItemText primary='Export my private key' />
    </ListItem>
    <CustomDialog
      open={showDialog}
      onClose={() => setShowDialog(false)}
      header="Raw Private Key"
      action={copyKey}
      actionText="Copy"
    >
      { error ? <p className='user-info-error'>{error}</p> : null }
      <TextField
        variant='filled'
        multiline
        name='privateKey'
        label='Private key'
        rows={28}
        fullWidth
        value={ privateKey }
        InputProps={{
          readOnly: true
        }}
      />
    </CustomDialog>
    </>
  )
}

export default ExportPrivateKey
