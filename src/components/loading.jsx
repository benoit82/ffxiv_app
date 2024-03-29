import React from 'react'
import ReactLoading from 'react-loading'

import './loading.css'

const Loading = () => {
  return (
    <>
      <ReactLoading
        className='loading'
        type='spinningBubbles'
        color='black'
        height='5%'
        width='5%'
      />
    </>
  )
}

export default Loading
