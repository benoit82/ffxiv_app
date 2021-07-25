import React from 'react'
import Button from 'react-bootstrap/Button'

const SendBtn = ({ label = 'envoyer', isDisabled = false }) => {
  return (
    <Button className='m-1' variant='primary' type='submit' disabled={isDisabled}>
      <i className='fas fa-paper-plane' />{label}
    </Button>
  )
}

export default SendBtn
