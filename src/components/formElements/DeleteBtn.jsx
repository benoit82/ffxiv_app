import React from 'react'
import Button from 'react-bootstrap/Button'

const DeleteBtn = ({ handleClick }) => {
    return (
        <Button variant="danger" onClick={handleClick}>
            <i className="fas fa-times-circle"></i>supprimer
        </Button >
    )
}

export default DeleteBtn