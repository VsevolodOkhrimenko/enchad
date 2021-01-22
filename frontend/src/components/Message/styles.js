import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  messageWrapper: {
    padding: '2px 20px',
    display: 'flex',
    '&.read': {

    }
  },
  owner: {
    textAlign: 'right',
    justifyContent: 'flex-end',
    '& .message': {
      backgroundColor: theme.palette.primary.main,
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
      color: theme.palette.common.white,
      borderRadius: '5px 5px 2px 5px'
    },
    '&.read': {
      '& .message': {
        // '&::before': {
        //   content: '"✓"',
        //   fontSize: '1rem',
        //   position: 'absolute',
        //   right: 0,
        //   bottom: 0,
        //   transform: 'translateX(calc(100% + 5px))',
        //   color:theme.palette.primary.main
        // }
        '&::before': {
          position: 'absolute',
          content: '""',
          width: '0.5rem',
          height: '0.25rem',
          border: `2px solid ${theme.palette.primary.main}`,
          borderRadius: '0.1rem',
          transform: 'rotate(-45deg)',
          borderTop: 'none',
          borderRight: 'none',
          left: 'calc(100% + 5px)',
          bottom: 16
        }
      }
    }
  },
  opponent: {
    textAlign: 'left',
    justifyContent: 'flex-start',
    '& .message': {
      backgroundColor: theme.palette.divider,
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
      color: theme.palette.text.primary,
      borderRadius: '5px 5px 5px 2px'
    }
  },
  message: {
    overflow: 'visible',
    position: 'relative',
    padding: '8px 10px',
    maxWidth: '70%',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    '&.error': {
      color: theme.palette.background.paper,
      opacity: 0.4,
      border: `1px solid ${theme.palette.error.main}`,

    }
  },
}))

export default useStyles
