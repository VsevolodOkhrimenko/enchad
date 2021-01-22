import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  threadsSidebar: {
    width: 300,
    paddingTop: '8px',
    '&.mobile': {
      width: '100%'
    }
  },
  closeDrawer: {
    justifyContent: 'flex-end',
    '& .MuiListItemIcon-root': {
      minWidth: 'auto'
    }
  },
  threadsList: {
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
      backgroundColor: '#F5F5F5',
      visibility: 'hidden'
    },
    '&::-webkit-scrollbar': {
      width: 6,
      visibility: 'hidden',
      backgroundColor: '#F5F5F5'
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: 10,
      boxShadow: 'inset 0 0 6px rgba(0,0,0,.3)',
      backgroundColor: '#555',
      visibility: 'hidden'
    },
    '&:hover': {
      '&::-webkit-scrollbar-thumb': {
        visibility: 'visible'
      }
    }
  },
  errorMessage: {
    padding: '1rem 1em'
  }
}))

export default useStyles
