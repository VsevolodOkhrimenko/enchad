import React from 'react'
import useStyles from './styles'


const Message = (props) => {
  const {
    id,
    text,
    read,
    senderClass
  } = props

  const classes = useStyles()

  return (
    <div id={id} className={`${classes.messageWrapper} ${senderClass === 'owner' ? classes.owner : classes.opponent} ${read ? 'read' : ''}`}>
      <div className={`message ${classes.message} ${text.type}`}>
        {text.content}
      </div>
    </div>
  )
}

export default Message
