import React from 'react'
import useStyles from './styles'

const Loader = () => {
  const classes = useStyles()

  return (
    <div className={classes.loaderWrapper} >
      <div className={classes.loader}>
        <div className={classes.loaderSectionOne}></div>
        <div className={classes.loaderSectionTwo}></div>
        <div className={classes.loaderSectionThree}></div>
      </div>
    </div>
  )
}

export default Loader
