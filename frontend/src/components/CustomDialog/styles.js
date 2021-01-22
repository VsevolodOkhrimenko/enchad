import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  dialogContent: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: '1.5rem',
    '& form': {
      width: '100%'
    },
    '& .form': {
      width: '100%'
    }
  },
  dialogActions: {
    width: '100%',
    paddingTop: '1rem'
  }
}))

export default useStyles
