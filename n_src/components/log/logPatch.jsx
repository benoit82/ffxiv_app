import React from 'react'
import logMd from '../../logs/log.md'
import ReactMd from 'react-md-file'
import Container from 'react-bootstrap/Container'


const LogPatch = () => {
    return (
        <Container>
            <ReactMd fileName={logMd} />
        </Container>
    )
}

export default LogPatch
