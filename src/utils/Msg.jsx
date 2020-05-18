import React from 'react'
import Alert from 'react-bootstrap/Alert'

const Msg = ({ error, info }) => {
    return (
        <>
            {info && <Alert variant="info">Information :<br />{info.message}</Alert>}
            {error && <Alert variant="danger">Une erreur est survenu :<br />{error.message}</Alert>}
        </>
    )
}

export default Msg
