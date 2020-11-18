import React from 'react'
import Button from 'react-bootstrap/Button'

const EditBtn = ({ label, handleClick }) => {
  const labelBtn = label || 'éditer'
  return (
    <Button variant='success' onClick={handleClick} className='m-1'>
      <i className='fas fa-edit' />{labelBtn}
    </Button>
  )
}

export default EditBtn
