import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { RosterForm } from '../roster'

const AdminOptionPage = () => {
    return (
        <Container>
            <Row>
                <Col lg={3}>
                    <h2>Menu admin</h2>
                    <ul>
                        <li>Roster</li>
                    </ul>
                </Col>
                <Col>
                    <Row>
                        <h1>Page admin</h1>
                    </Row>
                    <Row>
                        <RosterForm />
                        -> nom <br />
                        -> raid leader (id du personnage) <br />
                        -> ajouter des membres <br />

                        Editer un nouveau patch (wish list, nouveaux boss) <br />
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default AdminOptionPage
