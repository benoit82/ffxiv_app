import React, { useState, useContext, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup'
import EmailUpdateFrom from './emailUpdateFrom'
import { FirebaseContext } from '../firebase'
import { UserApi } from '../../utils/appContext'
import Msg from '../../utils/msg'
import { User, Roster } from '../../models'
import { Link } from 'react-router-dom'
import { DeleteBtn } from '../formElements'


/**
 * @route /param : /
 */
const UserOptionPage = () => {

    const [userFromDb, setUserFromDb] = useState(null)
    const [msgInfo, setMsgInfo] = useState(null)
    const [rosterTmp, setRosterTmp] = useState(null)
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
                    if (usr.refRosterRaidLeader) {
                        const getRoster = async () => {
                            const rost = new Roster(await usr.refRosterRaidLeader.get())
                            setRosterTmp(rost)
                        }
                        getRoster()
                    }
                },
                (error) => {
                    throw setMsgInfo(<Msg error={error.message} />)
                }
            );
        return () => unsubcribe()
    }, [user.uid, firebase.db])

    const handleDelete = () => {
        const confirmation = window.confirm(
            `êtes-vous certain de supprimer le roster temporaire : ${rosterTmp.name} ?`
        );
        if (confirmation) {
            firebase.deleteRoster(rosterTmp._id);
            setRosterTmp(null)
        }
    };

    return (
        <Container>
            {msgInfo && <Row>{msgInfo}</Row>}
            {userFromDb && <Row className="mt-1 mb-5">
                <ListGroup>
                    <ListGroup.Item>Pseudo : {userFromDb.pseudo}</ListGroup.Item>
                    <ListGroup.Item>Email : {userFromDb.email}</ListGroup.Item>
                </ListGroup>
            </Row>}
            <Row>
                <EmailUpdateFrom />
            </Row>
            {rosterTmp && <>
                <hr />
                <Row className="d-flex flex-column">
                    <h2>Mon roster temporaire</h2>
                    <div>
                        <h4>{rosterTmp.name}</h4>
                        <Link to={`/roster/edit/${rosterTmp._id}`} className="btn btn-success"><i className="fas fa-edit"></i>Editer</Link>
                        {" "}<Link to={`/roster/view/${rosterTmp._id}/1`} className="btn btn-primary"><i className="fas fa-eye"></i>Voir</Link>
                        {" "}<DeleteBtn handleClick={handleDelete} />
                    </div>
                </Row>
            </>}

        </Container>)
}

export default UserOptionPage
