 import './Loader.scss'
import React from 'react'
import { useTheme } from '@material-ui/core/styles'

const Loader = () => {
  const theme = useTheme()

  return (
    <div className='loader-wrapper'>
      <div
        className='loader'
        style={{ borderColor: `${theme.palette.primary.main} transparent ${theme.palette.primary.main} transparent`}}
      />
    </div>
  )
}

export default Loader
