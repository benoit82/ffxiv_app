import React from 'react'
import Button from 'react-bootstrap/Button'

const AddBtn = ({ handleClick, label }) => {
  const labelBtn = label || 'ajouter'
  return (
    <Button className='m-1' variant='primary' type='reset' onClick={handleClick}>
      <i className='fas fa-user-plus' />{labelBtn}
    </Button>
  )
}

export default AddBtn
