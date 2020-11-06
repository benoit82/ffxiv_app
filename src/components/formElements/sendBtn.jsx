import React from 'react'
import Button from 'react-bootstrap/Button';

const SendBtn = ({ label, isDisabled }) => {
    const labelBtn = label || "envoyer"
    const isDisabledBtn = isDisabled || false
    return (
        <Button className="m-1" variant="primary" type="submit" disabled={isDisabledBtn}>
            <i className="fas fa-paper-plane"></i>{labelBtn}
        </Button>
    )
}

export default SendBtn
