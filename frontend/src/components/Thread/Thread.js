import './Thread.scss'
import {
  ListItem,
  ListItemText,
  Badge
} from '@material-ui/core'
import React from 'react'
import history from 'browserHistory'


const Thread = (props) => {
  const {
    id,
    opponent,
    unreadCount,
    selected
  } = props

  return (
    <ListItem
      onClick={() => history.push(`/${id}`)}
      button
      className="thread-item"
      selected={selected}
    >
      <Badge badgeContent={unreadCount} color="secondary">
        <ListItemText primary={`Chat with ${opponent["username"]}`} />
      </Badge>
    </ListItem>
  )}

export default Thread