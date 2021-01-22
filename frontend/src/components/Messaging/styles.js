import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  threadContainer: {
    height: 'calc(100vh - 64px)',
    overflowY: 'auto',
    position: 'relative',
    paddingTop: 10,
    paddingBottom: 10,
    boxSizing: 'border-box',
    '&::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.divider,
      visibility: 'hidden'
    },
    '&::-webkit-scrollbar': {
      width: 6,
      visibility: 'hidden',
      backgroundColor: '#F5F5F5'
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      backgroundColor: theme.palette.action.active,
      visibility: 'hidden'
    },
    '&:hover': {
      '&::-webkit-scrollbar-thumb': {
        visibility: 'visible'
      },
      '&::-webkit-scrollbar-track': {
        visibility: 'visible'
      }
    }
  },
  ready: {
    height: 'calc(100vh - 134px)'
  },
  chatNotInitiated: {
    textAlign: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    marginTop: 'auto',
    marginBottom: 'auto',
    left: 0,
    width: '100%',
    height: 'fit-content'
  },
  content: {
    transition: 'margin-right 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
    marginRight: 0,
    '&.sidebar-open': {
      marginRight: 221
    }
  },
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
