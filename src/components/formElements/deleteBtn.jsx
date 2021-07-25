import React from 'react'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'

const DeleteBtn = ({ handleClick, label = 'supprimer' }) => {
  return (
    <Button className='mr-0 ml-0 mt-1' variant='danger' onClick={handleClick}>
      <i className='fas fa-times-circle' />{label}
    </Button>
  )
}

DeleteBtn.propTypes = {
  handleClick: PropTypes.func.isRequired,
  label: PropTypes.string
}

export default DeleteBtn
