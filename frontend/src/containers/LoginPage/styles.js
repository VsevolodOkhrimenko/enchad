import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh'
  },
  loginInnerContainer: {
    position: 'relative',
    alignSelf: 'center'
  },
  submitFormBtnWrapper: {
    paddingTop: 20,
    paddingBottom: 10,
    textAlign: 'right'
  },
  loginBtn: {
    width: 146
  },
  fieldWrapper: {
    marginBottom: 32
  }
}))

export default useStyles
