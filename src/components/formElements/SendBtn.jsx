import React from 'react'
import Button from 'react-bootstrap/Button';

const SendBtn = ({ label }) => {
    const labelBtn = label || "envoyer"
    return (
        <Button className="m-1" variant="primary" type="submit">
            <i className="fas fa-paper-plane"></i>{labelBtn}
        </Button>
    )
}

export default SendBtn
