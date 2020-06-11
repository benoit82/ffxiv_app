import React, { useState, useContext, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup'
import EmailUpdateFrom from './emailUpdateFrom'
import { FirebaseContext } from '../firebase'
import { UserApi } from '../../utils/appContext'
import Msg from '../../utils/msg'
import { User } from '../../models'


/**
 * @route /param : /
 */
const UserOptionPage = () => {

    const [userFromDb, setUserFromDb] = useState(null)
    // const [userCharacters, setUserCharacters] = useState([])
    const [msgInfo, setMsgInfo] = useState(null)
    const firebase = useContext(FirebaseContext)
    const { user } = useContext(UserApi)

    useEffect(() => {
        let unsubcribe = firebase.db
            .collection("users")
            .doc(user.uid)
            .onSnapshot(
                (snapshot) => {
                    const usr = new User(snapshot)
                    setUserFromDb(usr)
                },
                (error) => {
                    throw setMsgInfo(<Msg error={error.message} />)
                }
            );
        return () => unsubcribe()
    }, [user.uid, firebase.db])

    return (
        <Container>
            {msgInfo && <Row>{msgInfo}</Row>}
            {userFromDb && <Row>
                <ListGroup>
                    <ListGroup.Item>Pseudo : {userFromDb.pseudo}</ListGroup.Item>
                    <ListGroup.Item>Email : {userFromDb.email}</ListGroup.Item>
                </ListGroup>
            </Row>}
            <Row>
                <EmailUpdateFrom />
            </Row>
        </Container>)
}

export default UserOptionPage
