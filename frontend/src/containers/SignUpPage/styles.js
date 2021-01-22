import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  signUpContainer: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh'
  },
  signUpInnerContainer: {
    position: 'relative',
    alignSelf: 'center'
  },
  submitFormBtn: {
    paddingTop: 20,
    paddingBottom: 10,
    textAlign: 'right'
  },
  fieldWrapper: {
    marginBottom: 32
  }
}))

export default useStyles
