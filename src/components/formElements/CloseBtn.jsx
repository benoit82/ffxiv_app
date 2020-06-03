import React from 'react'
import Button from 'react-bootstrap/Button';

const CloseBtn = ({ label, handleClick }) => {
    const labelBtn = label || "fermer"
    return (
        <Button className="m-1" variant="warning" onClick={handleClick}>
            <i className="fas fa-window-close"></i>{labelBtn}
        </Button >
    )
}

export default CloseBtn
