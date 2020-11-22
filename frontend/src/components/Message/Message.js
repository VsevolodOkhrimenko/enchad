import './Message.scss'
import React from 'react'


const Message = (props) => {
  const {
    id,
    text,
    read,
    senderClass
  } = props

  return (
    <div id={id} className={`message-wrapper ${senderClass} ${read ? 'read' : ''}`}>
      <div className={`message ${text['type']}`}>
        {text['content']}
      </div>
    </div>
  )}

export default Message