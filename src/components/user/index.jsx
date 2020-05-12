import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const UserOptionPage = () => {

    // créer un useEffect pour charger le personnage, sinon, proposer de chercher le personnage et 

    return (
        <Container fluid>
            <h1>Espace utilisateur</h1>
            <Row>
                <Col xs={12} lg={3}>MenuConfigPerso
                <ul>
                        <li>Ajouter un personnage</li>
                    </ul>
                </Col>
                <Col>Fiche du personnage (si au moins 1 personnage associé au compte utilisateur)
                </Col>
            </Row>
        </Container>
    )
}

export default UserOptionPage
