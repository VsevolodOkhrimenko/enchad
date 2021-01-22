import {
  ListItem,
  ListItemText,
  Badge
} from '@material-ui/core'
import React from 'react'
import history from 'browserHistory'
import useStyles from './styles'


const Thread = (props) => {
  const {
    id,
    opponent,
    unreadCount,
    selected
  } = props

  const classes = useStyles()

  return (
    <ListItem
      onClick={() => history.push(`/${id}`)}
      button
      className={classes.threadItem}
      selected={selected}
      divider
    >
      <Badge badgeContent={unreadCount} color='secondary'>
        <ListItemText primary={`Chat with ${opponent.username}`} />
      </Badge>
    </ListItem>
  )
}

export default Thread
