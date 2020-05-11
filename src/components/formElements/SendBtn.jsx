import React from 'react'
import Button from 'react-bootstrap/Button';

const SendBtn = () => {
    return (
        <Button variant="primary" type="submit">
            <i className="fas fa-paper-plane"></i>Envoyer
        </Button>
    )
}

export default SendBtn
