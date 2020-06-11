import React, { useContext } from 'react'
import { BrowserRouter as Router, Link, Switch } from 'react-router-dom'
import { ChrOptionPage, EditCharacter } from '../character'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import ProtectedRoute from '../../utils/protectedRoute'
import { UserApi } from '../../utils/appContext'
import UserOptionPage from './userOptionPage'
import RosterEdit from '../roster/rosterEdit'
import { RosterView, RosterCreate } from '../roster'

/**
 * @route /param
 */
const UserParamPage = () => {
    const User = useContext(UserApi)

    const { user, } = User

    return (
        <Router basename="/param">
            <Container>
                <Row>
                    <ul className="p-0 ml-0" style={{ display: "flex", listStyle: "none" }}>
                        <li><Link to={"/"} className="btn btn-primary mr-3">mon compte</Link></li>
                        <li><Link to={"/chr"} className="btn btn-success mr-3">mes persos</Link></li>
                    </ul>
                </Row>
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
                            path="/roster/create/:character_id"
                            allowedUser={user.isLoggedIn}
                        >
                            <RosterCreate
                                userChrList={user.characters} />
                        </ProtectedRoute>
                        <ProtectedRoute
                            path="/roster/edit/:roster_id"
                            allowedUser={user.isLoggedIn}
                            component={RosterEdit}
                        />

                        <ProtectedRoute
                            path="/roster/:roster_id/:jPriority"
                            allowedUser={user.isLoggedIn}
                            component={RosterView}
                        />

                    </Switch>
                </Row>
            </Container>
        </Router >
    )
}

export default UserParamPage
