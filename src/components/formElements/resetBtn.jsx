import React from 'react'
import Button from 'react-bootstrap/Button'

const ResetBtn = ({ label, handleReset, isDisabled }) => {
  const labelBtn = label || 'réinitialiser'
  const isDisabledBtn = isDisabled || false
  return (
    <Button className='m-1' variant='secondary' type='reset' onClick={handleReset} disabled={isDisabledBtn}>
      <i className='fas fa-recycle' />{labelBtn}
    </Button>
  )
}

export default ResetBtn
