import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { UserOptionPage } from '..'
import UsersAdmin from './usersAdmin'
import AdminWelcomePage from './adminWelcomePage'
import RosterAdmin from './rosterAdmin'

/**
 * @route /admin
 */
const AdminOptionPage = () => {
    return (
        <Router basename="/admin">
            <Container>
                <Row>
                    <Col lg={3}>
                        <h2>Menu</h2>
                        <ul>
                            <li><Link to="/users">Gestion des utilisateurs</Link></li>
                            <li><Link to="/roster">Gestion des rosters</Link></li>
                        </ul>
                    </Col>
                    <Col>
                        <h1>Administration du site</h1>
                        <Switch>
                            <Route exact path="/" component={AdminWelcomePage} />
                            <Route exact path="/users" component={UsersAdmin} />
                            <Route path="/users/:user_id" component={UserOptionPage} />
                            <Route exact path="/roster" component={RosterAdmin} />
                        </Switch>
                    </Col>
                </Row>
            </Container>
        </Router>
    )
}

export default AdminOptionPage
