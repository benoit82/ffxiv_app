import React from 'react'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'

const EditBtn = ({ handleClick, label = 'éditer' }) => {
  return (
    <Button variant='success' onClick={handleClick} className='m-1'>
      <i className='fas fa-edit' />{label}
    </Button>
  )
}

EditBtn.propTypes = {
  handleClick: PropTypes.func.isRequired,
  label: PropTypes.string
}

export default EditBtn
