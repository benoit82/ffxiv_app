import React, { useState, useContext, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup'
import EmailUpdateFrom from './emailUpdateFrom'
import Button from 'react-bootstrap/Button'
import { FirebaseContext } from '../firebase'
import { UserApi } from '../../utils/appContext'
import Msg from '../../utils/msg'
import { EMAIL_UPDATE, ROSTER_CREATE } from '../../utils/consts'
import { User, Character } from '../../models'
import RosterCreate from '../roster/rosterCreate'


/**
 * @route /param : /
 */
const UserOptionPage = () => {

    const [userFromDb, setUserFromDb] = useState(null)
    const [userCharacters, setUserCharacters] = useState([])
    const [msgInfo, setMsgInfo] = useState(null)
    const [showActiveForm, setShowActiveForm] = useState(null)
    const firebase = useContext(FirebaseContext)
    const { user } = useContext(UserApi)

    useEffect(() => {
        let unsubcribe = firebase.db
            .collection("users")
            .where("uid", "==", user.uid)
            .onSnapshot(
                (snapshot) => {
                    const usr = new User(snapshot.docs[0].data())
                    setUserFromDb(usr)
                    if (usr.characters.length > 0) {
                        let chrList = []
                        for (const chrRef of usr.characters) {
                            chrRef.get()
                                .then(res => {
                                    chrList.push(new Character(res))
                                })
                                .catch(error => setMsgInfo(<Msg error={error.message} />))
                        }
                        setUserCharacters(chrList)
                    }
                },
                (error) => {
                    throw setMsgInfo(<Msg error={error.message} />)
                }
            );
        return () => unsubcribe()
    }, [firebase])

    const activeForm = (activeForm) => {
        switch (activeForm) {
            case EMAIL_UPDATE:
                setShowActiveForm(<EmailUpdateFrom />)
                break
            case ROSTER_CREATE:
                setShowActiveForm(<RosterCreate userChrList={userCharacters} />)
                break
            default:
                setShowActiveForm(null)
                break
        }
    }

    return (
        <Container>
            {msgInfo && <Row>{msgInfo}</Row>}
            {userFromDb && <Row>
                <ListGroup>
                    <ListGroup.Item>Pseudo : {userFromDb.pseudo}</ListGroup.Item>
                    <ListGroup.Item>Email : {userFromDb.email}
                        <Button variant="primary" className="m-1" onClick={() => activeForm(EMAIL_UPDATE)}>
                            <i className="fas fa-edit"></i>modifier
                        </Button>
                    </ListGroup.Item>
                    <ListGroup.Item>{userFromDb.refRosterRaidLeader
                        ?
                        <Button variant="primary" className="m-1" onClick={(e) => console.log(e)}>
                            <i className="fas fa-edit">Ajouter des membres</i>
                        </Button>
                        :
                        <Button variant="primary" className="m-1" onClick={() => activeForm(ROSTER_CREATE)}>
                            <i className="fas fa-edit"></i>créer un nouveau roster
                        </Button>
                    }
                    </ListGroup.Item>
                </ListGroup>
            </Row>}
            <Row>
                {showActiveForm}
            </Row>
        </Container>)
}

export default UserOptionPage
