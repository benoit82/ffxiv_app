import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import AddCharacter from './AddCharacter'

const UserOptionPage = () => {

    // créer un useEffect pour charger le personnage, sinon, proposer de chercher le personnage et 

    return (
        <Container fluid>
            <h1>Mes personnages</h1>
            <Row>
                <Col xs={12} lg={3}>
                    <ul>
                        <li>Menu : Mes personnages</li>
                    </ul>
                </Col>
                {/* routes */}
                <Col>
                    <AddCharacter />
                </Col>
            </Row>
        </Container>
    )
}

export default UserOptionPage
