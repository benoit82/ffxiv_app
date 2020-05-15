import React from 'react'
import Button from 'react-bootstrap/Button';

const AddBtn = ({ handleClick, label }) => {
    return (
        <Button variant="primary" type="reset" onClick={handleClick}>
            <i className="fas fa-user-plus"></i>Ajouter {label}
        </Button >
    )
}

export default AddBtn
