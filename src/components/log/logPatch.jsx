import React from 'react'
import logMd from '../../logs/log.md'
import ReactMd from 'react-md-file'

import './logPatch.scss'

const LogPatch = () => {
  return (
    <div className='custom__container log__container'>
      <ReactMd fileName={logMd} />
    </div>
  )
}

export default LogPatch
