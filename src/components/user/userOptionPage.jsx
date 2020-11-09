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
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'


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
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [])

    const handleRosterTmpDelete = async () => {
        const confirmation = await Swal.fire({
            icon: "warning",
            html: `êtes-vous certain de supprimer le roster temporaire: ${rosterTmp.name} ?`,
            cancelButtonText: "annuler",
            showCancelButton: true,
            confirmButtonText: "oui, certain"
        })
        if (confirmation.value) {
            firebase.deleteRoster(rosterTmp._id);
            setRosterTmp(null)
            const Toast = Swal.mixin({
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
            })
            Toast.fire({
                icon: 'success',
                title: `${rosterTmp.name} supprimé !`,
            })
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
                    <h2>Mon roster temporaire</h2><span style={{ color: "gray", fontStyle: "italic", fontSize: "0.8rem", marginBottom: "1.5rem" }}>cliques sur le nom pour copier le lien pour la visu</span>
                    <div className="d-flex">
                        <CopyToClipboard text={`${window.location.origin}/roster/view/${rosterTmp._id}/1`}>
                            <h4 className="mr-5"><Button><i className="fas fa-clipboard"></i>{rosterTmp.name}</Button></h4>
                        </CopyToClipboard>
                        <div style={{ display: "flex", width: "30vw", justifyContent: "space-between" }}>
                            <Link to={`/roster/view/${rosterTmp._id}/1`} className="btn btn-primary"><i className="fas fa-eye"></i>Voir</Link>
                            <Link to={`/roster/edit/${rosterTmp._id}`} className="btn btn-success"><i className="fas fa-edit"></i>Editer</Link>
                            <DeleteBtn handleClick={handleRosterTmpDelete} />
                        </div>
                    </div>
                </Row>
            </>}

        </Container>)
}

export default UserOptionPage
