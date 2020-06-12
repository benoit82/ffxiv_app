import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import Msg from '../../utils/msg'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Select from 'react-select'
import Col from 'react-bootstrap/Col'
import * as pluralize from 'pluralize'
import { UpdateBtn, DeleteBtn } from '../formElements'
import { Character, Roster } from '../../models'
import { MAX_MEMBERS_ALLOWED } from '../../utils/consts'
import { UserApi } from '../../utils/appContext'



const RosterEdit = () => {
    const { roster_id } = useParams()
    const history = useHistory()
    const firebase = useContext(FirebaseContext)
    const User = useContext(UserApi)
    const { user } = User

    const [roster, setRoster] = useState(new Roster(null))
    const [infoMsg, setInfoMsg] = useState(null)
    const [characters, setCharacters] = useState([])
    const [raidLeader, setRaidLeader] = useState(null)
    //--- select
    const [name, setName] = useState("")
    const [rosterMembers, setRosterMembers] = useState([])

    useEffect(() => {
        firebase.getAllCharacters(setCharacters, { filter: "rosterRaidLeader" })
    }, [firebase])

    useEffect(() => {
        // load the roster
        const unsubcribe = firebase.db
            .collection("rosters")
            .doc(roster_id)
            .onSnapshot(
                (snapshot) => {
                    const rosterData = snapshot.data()
                    setRoster(new Roster(snapshot))
                    if (rosterData.refRaidLeader) {
                        rosterData.refRaidLeader.get().then(resp => {
                            console.log(resp.data().userRef)
                            console.log(user.uid)
                            debugger
                            // check if  the user is allowed to access to roster edit
                            if (user.isAdmin || (user.uid === resp.data().userRef.id)) {
                                setRaidLeader(new Character(resp))
                            } else {
                                history.push("/")
                            }
                        })
                    }
                    if (rosterData.rosterMembers) {
                        let rosterMembers = []
                        rosterData.rosterMembers.forEach(chrRef => {
                            chrRef.get().then(data => {
                                rosterMembers = [...rosterMembers, new Character(data)]
                            })
                        })
                        setRosterMembers(rosterMembers)
                    }
                },
                (error) => {
                    throw setInfoMsg(<Msg error={error.message} />);
                }
            );

        return () => unsubcribe();
    }, []);

    useEffect(() => {
        if (roster.rosterMembers) {
            let initChrs = []
            const convertRefMemberToChr = async () => {
                for (const memberRef of roster.rosterMembers) {
                    const res = (await memberRef.get())
                    if (res) {
                        initChrs = [...initChrs, new Character(res)]
                    }
                }
                setRosterMembers(initChrs)
            }
            convertRefMemberToChr()
        }
        setName(roster.name)
    }, [roster])

    const handleSubmit = (event) => {
        event.preventDefault()
        // record characters to refs
        let rosterMembersTmp = []
        rosterMembers.forEach(member => {
            rosterMembersTmp = [...rosterMembersTmp, firebase.db.doc(`characters/${member._id}`)]
        })
        if (name) {
            const rosterPayload = {
                _id: roster._id,
                name,
                rosterMembers: rosterMembersTmp
            }
            try {
                firebase.updateRoster(rosterPayload)
                setInfoMsg(<Msg info={"Roster mis à jour !"} />)
                setTimeout(() => {
                    setInfoMsg(null)
                }, 1500);
            } catch (error) {
                setInfoMsg(<Msg error={error.message} />)
            }
        } else {
            setInfoMsg(<Msg error={"champs invalides ou non completé"} />)
        }
    }

    const handleChangeMembers = (tabValues) => {
        if (tabValues !== null) {
            if (tabValues.length <= MAX_MEMBERS_ALLOWED) {
                tabValues.sort((a, b) => a.label > b.label ? 1 : -1)
                setRosterMembers(tabValues)
            }
        } else {
            setRosterMembers([])
        }
    }

    const deleteRoster = () => {
        firebase.deleteRoster(roster_id)
        history.replace("/chr")
    }

    return (
        <Container>
            {infoMsg && <Row>{infoMsg}</Row>}
            <Row>
                <Col>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Nom du roster</Form.Label>
                            <br />
                            <Form.Control
                                custom
                                type="text"
                                id="name"
                                placeholder="Nom du roster"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                        </Form.Group>

                        {raidLeader && <h2>Raid Leader : {raidLeader.name}</h2>}

                        <Form.Group>
                            <Form.Label>{rosterMembers && `${pluralize("membre", rosterMembers.length, true)} / ${MAX_MEMBERS_ALLOWED}`}</Form.Label>
                            <Select
                                id="refRosterMembers"
                                isMulti
                                placeholder="Selection des membres..."
                                options={characters}
                                onChange={(optionSelected) => handleChangeMembers(optionSelected)}
                                value={rosterMembers}
                            />
                        </Form.Group>

                        <UpdateBtn />
                        <DeleteBtn
                            label="supprimer le roster"
                            handleClick={deleteRoster}
                        />
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default RosterEdit
