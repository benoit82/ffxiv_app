import React from 'react'
import Button from 'react-bootstrap/Button'

const DeleteBtn = ({ label, handleClick }) => {
    const labelBtn = label || "supprimer"
    return (
        <Button className="m-1" variant="danger" onClick={handleClick}>
            <i className="fas fa-times-circle"></i>{labelBtn}
        </Button >
    )
}

export default DeleteBtn