import React, { useContext } from 'react'
import { UserApi } from '../../utils/appContext'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

/**
 * @route /param : /
 */
const UserOptionPage = () => {
    const User = useContext(UserApi)
    const { user: { pseudo } } = User
    return (
        <Container>
            <Row>
                UserOptionPage : {pseudo}
            </Row>
            <Row>
                <ul>
                    <li>Mettre à jour son email</li>
                    <li>Créer un roster (proposer liste de ses persos comme RL)</li>
                </ul>
            </Row>
            <Row>

            </Row>
        </Container>)
}

export default UserOptionPage
