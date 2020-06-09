import React, { useContext } from 'react'
import { BrowserRouter as Router, Link, Switch } from 'react-router-dom'
import { ChrOptionPage, EditCharacter } from '../character'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ProtectedRoute from '../../utils/protectedRoute'
import { UserApi } from '../../utils/appContext'
import UserOptionPage from './userOptionPage'
import RosterEdit from '../roster/rosterEdit'
import { RosterView } from '../roster'

/**
 * @route /param
 */
const UserParamPage = () => {
    const User = useContext(UserApi)

    const { user } = User

    return (
        <Router basename="/param">
            <Container>
                <Row>
                    <Col lg={2}>Menu
                        <ul>
                            <li><Link to={"/"}>mon compte</Link></li>
                            <li><Link to={"/chr"}>mes persos</Link></li>
                            {user.refRosterRaidLeader && <li><Link to={`/roster/edit/${user.refRosterRaidLeader}`}>mon roster (RL)</Link></li>}
                        </ul>
                    </Col>
                    <Col>
                        <Row>
                            <Switch>
                                <ProtectedRoute
                                    exact
                                    path="/"
                                    allowedUser={user.isLoggedIn}
                                    component={UserOptionPage}
                                />
                                <ProtectedRoute
                                    exact
                                    path="/chr"
                                    allowedUser={user.isLoggedIn}
                                    component={ChrOptionPage}
                                />
                                <ProtectedRoute
                                    path="/chr/:chr_id"
                                    allowedUser={user.isLoggedIn}
                                    component={EditCharacter}
                                />
                                <ProtectedRoute
                                    path="/roster/edit/:roster_id"
                                    allowedUser={user.isLoggedIn}
                                    component={RosterEdit}
                                />
                                <ProtectedRoute
                                    path="/roster/:roster_id"
                                    allowedUser={user.isLoggedIn}
                                    component={RosterView}
                                />
                            </Switch>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Router >
    )
}

export default UserParamPage
