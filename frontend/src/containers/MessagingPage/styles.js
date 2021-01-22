import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  content: {
    marginLeft: 0,
    marginRight: 0,
    transition: 'all 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
    height: '100vh'
  },
  threadsOpen: {
    marginLeft: '300px'
  },
  settingsOpen: {
    marginRight: '300px'
  }
}))

export default useStyles
