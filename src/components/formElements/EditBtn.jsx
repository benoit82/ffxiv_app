import React from 'react'
import Button from 'react-bootstrap/Button'

const EditBtn = ({ handleClick }) => {
    return (
        <Button variant="success" onClick={handleClick}>
            <i className="fas fa-edit"></i>Editer
        </Button>
    )
}

export default EditBtn
