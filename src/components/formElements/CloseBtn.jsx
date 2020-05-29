import React from 'react'
import Button from 'react-bootstrap/Button';

const CloseBtn = ({ handleClick }) => {
    return (
        <Button variant="warning" onClick={handleClick}>
            <i className="fas fa-window-close"></i>fermer
        </Button >
    )
}

export default CloseBtn
