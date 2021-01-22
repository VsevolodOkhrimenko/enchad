import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  loaderWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    width: '100%',
    height: '100%'
  },
  loader: {
    display: 'flex',
    height: '2rem'
  },
  loaderSectionOne: {
    width: '1rem',
    borderRadius: '0.4rem',
    margin: '0 0.45rem',
    backgroundColor: theme.palette.secondary.main,
    animation: '$even 700ms cubic-bezier(.5,0,1,1) infinite alternate'
  },
  loaderSectionTwo: {
    width: '1rem',
    borderRadius: '0.4rem',
    margin: '0 0.45rem',
    backgroundColor: theme.palette.primary.main,
    animation: '$odd 700ms cubic-bezier(.5,0,1,1) infinite alternate'
  },
  loaderSectionThree: {
    width: '1rem',
    borderRadius: '0.4rem',
    margin: '0 0.45rem',
    backgroundColor: theme.palette.branding,
    animation: '$even 700ms cubic-bezier(.5,0,1,1) infinite alternate'
  },
  '@keyframes even': {
    '0%': {
      height: '2rem'
    },
    '100%': {
      height: '1.25rem'
    }
  },
  '@keyframes odd': {
    '0%': {
      height: '1.25rem'
    },
    '100%': {
      height: '2rem'
    }
  }
}))

export default useStyles
