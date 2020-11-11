import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Switch, Route, Link } from 'react-router-dom'
import { UserOptionPage } from '..'
import UsersAdmin from './usersAdmin'
import RosterAdmin from './rosterAdmin'

/**
 * @route /admin
 */
const AdminOptionPage = () => {
    return (
        <Container fluid>
            <Row>
                <Col lg={3}>
                    <Row><Link to="/admin/users" className="btn btn-primary mb-2">Gestion des utilisateurs</Link></Row>
                    <Row><Link to="/admin/roster" className="btn btn-info mb-2">Gestion des rosters</Link></Row>
                </Col>
                <Col>
                    <Row><h1>Administration du site</h1></Row>
                    <Row>
                        <Switch>
                            <Route exact path="/admin/users" component={UsersAdmin} />
                            <Route path="/admin/users/:user_id" component={UserOptionPage} />
                            <Route exact path="/admin/roster" component={RosterAdmin} />
                        </Switch>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default AdminOptionPage
