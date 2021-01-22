import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  settingsSidebar: {
    width: 300,
    '& .mobile': {
      width: '100%'
    }
  }
}))

export default useStyles
