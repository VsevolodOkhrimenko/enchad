import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  privateKeyAccordion: {
    paddingBottom: '1rem'
  },
  submitFormBtn: {
    paddingTop: 20,
    paddingBottom: 10,
    textAlign: 'right',
  },
  errorMessage: {
    color: theme.palette.error.main
  }
}))

export default useStyles
