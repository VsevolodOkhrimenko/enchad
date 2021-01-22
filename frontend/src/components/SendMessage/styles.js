import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  messagesForm: {
    height: 70,
    paddingBottom: 5,
    position: 'relative',
    '& .MuiFormControl-root': {
      resize: 'none',
      height: 65,
      boxSizing: 'border-box',
      '& .MuiInputBase-root': {
        height: '100%'
      }
    }
  }
}))

export default useStyles
