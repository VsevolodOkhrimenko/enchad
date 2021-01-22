import React from 'react'
import useStyles from './styles'


const EmptyThread = () => {
  const classes = useStyles()

  return (
    <div className={`full-height-component ${classes.emptyThread}`}>
      <div className='wrapper'>
        <p>No thread is opened</p>
      </div>
    </div>
  )
}


export default EmptyThread
