import React from 'react'
import Alert from 'react-bootstrap/Alert'

const Msg = ({ error, info }) => {
    return (
        <>
            {info && <Alert variant="info">Information :<br />{info}</Alert>}
            {error && <Alert variant="danger">Une erreur est survenue :<br />{error}</Alert>}
        </>
    )
}

export default Msg
