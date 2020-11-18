import React from 'react'
import Button from 'react-bootstrap/Button'

const UpdateBtn = ({ label }) => {
  const labelBtn = label || 'mettre à jour'
  return (
    <Button className='m-1' variant='primary' type='submit'>
      <i className='fas fa-sync' />{labelBtn}
    </Button>
  )
}

export default UpdateBtn
