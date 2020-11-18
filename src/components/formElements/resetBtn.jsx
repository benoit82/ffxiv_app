import React from 'react'
import Button from 'react-bootstrap/Button'

const ResetBtn = ({ label, handleReset }) => {
  const labelBtn = label || 'réinitialiser'
  return (
    <Button className='m-1' variant='secondary' type='reset' onClick={handleReset}>
      <i className='fas fa-recycle' />{labelBtn}
    </Button>
  )
}

export default ResetBtn
