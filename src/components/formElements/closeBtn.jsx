import React from 'react'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'

const CloseBtn = ({ handleClick, label = 'fermer' }) => {
  return (
    <Button className='m-1' variant='warning' onClick={handleClick}>
      <i className='fas fa-window-close' />{label}
    </Button>
  )
}
CloseBtn.propTypes = {
  handleClick: PropTypes.func.isRequired,
  label: PropTypes.string
}

export default CloseBtn
