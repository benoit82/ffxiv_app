import React, { useContext } from 'react'
import { Link, Switch } from 'react-router-dom'
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
        <Container>
            <Row>
                <ul className="p-0 ml-0" style={{ display: "flex", listStyle: "none" }}>
                    <li><Link to={"/param"} className="btn btn-primary mr-3">mon compte</Link></li>
                    <li><Link to={"/param/chr"} className="btn btn-success mr-3">mes persos</Link></li>
                </ul>
            </Row>
            <Row>
                <Switch>
                    <ProtectedRoute
                        exact
                        path="/param"
                        allowedUser={user.isLoggedIn}
                        component={UserOptionPage}
                    />
                    <ProtectedRoute
                        exact
                        path="/param/chr"
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
                        component={RosterCreate}
                    />
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
    )
}

export default UserParamPage
