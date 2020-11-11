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
                <Col lg={2} className="d-flex flex-column mr-3">
                    <Link to="/admin/users" className="btn btn-primary mb-2">Gestion des utilisateurs</Link>
                    <Link to="/admin/roster" className="btn btn-info mb-2">Gestion des rosters</Link>
                </Col>
                <Col className="d-flex flex-column justify-content-center align-items-center">
                    <div className="custom__container form__container mb-3" style={{ textAlign: "center" }}>
                        <h1>Administration du site</h1>
                    </div>
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
