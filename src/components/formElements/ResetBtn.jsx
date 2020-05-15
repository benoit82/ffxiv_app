import React from 'react'
import Button from 'react-bootstrap/Button';

const ResetBtn = ({ handleReset }) => {
    return (
        <Button variant="secondary" type="reset" onClick={handleReset}>
            <i className="fas fa-recycle"></i>Réinitialiser
        </Button >
    )
}

export default ResetBtn