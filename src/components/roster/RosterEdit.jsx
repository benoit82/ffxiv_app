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
import { UpdateBtn } from '../formElements'



const RosterEdit = () => {
    const history = useHistory()
    const { roster_id } = useParams()
    const firebase = useContext(FirebaseContext)

    const MAX_MEMBERS_ALLOWED = 7

    const [roster, setRoster] = useState({})
    const [errorMsg, setErrorMsg] = useState(null)
    const [characters, setCharacters] = useState([])
    //--- select
    const [name, setName] = useState("")
    const [raidLeader, setRaidLeader] = useState({})
    const [charactersFiltered, setCharactersFiltered] = useState([])
    const [rosterMembers, setRosterMembers] = useState([])

    useEffect(() => {
        firebase.getRoster(roster_id, setRoster, setErrorMsg)
        firebase.getAllCharacters(setCharacters)
    }, [])

    useEffect(() => {
        findRaidLeader()
        if (raidLeader.value) {
            setCharactersFiltered(characters.filter(chr => chr.value !== raidLeader.value))
        }
    }, [characters, raidLeader])

    useEffect(() => {
        setRosterMembers(roster.rosterMembers)
        setName(roster.name)
    }, [roster])

    const findRaidLeader = async () => {
        let rl = roster.refRaidLeader ? (await roster.refRaidLeader.get()).data() : {}
        if (!raidLeader.value) {
            // on load
            if (characters.some(chr => chr.id === rl.id)) {
                rl = characters.find(chr => chr.id === rl.id)
            }
        } else {
            // on change for raid leader list selected
            if (characters.some(chr => chr.value === raidLeader.value)) {
                rl = characters.find(chr => chr.value === raidLeader.value)
                // removing raid leader if he has been selected on member list
                if (rosterMembers) {
                    setRosterMembers(rosterMembers.filter(chr => chr.value !== raidLeader.value))
                } else {
                    setRosterMembers([])
                }
            }
        }
        setRaidLeader(rl)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        // convert characters to ref
        let rosterMembersCopy = []
        rosterMembers.forEach(member => {
            rosterMembersCopy = [...rosterMembersCopy, { refMember: firebase.db.doc(`characters/${member._id}`) }]
        })
        if (raidLeader && name) {
            const newRosterSetup = {
                ...roster,
                name,
                refRaidLeader: firebase.db.doc(`characters/${raidLeader._id}`),
                rosterMembers: rosterMembersCopy
            }
            firebase.setRoster(newRosterSetup)
            history.push("/admin")
        } else {
            setErrorMsg("champs invalides ou non completé")
        }

    }

    const handleChange = (tabValues) => {
        if (tabValues !== null) {
            if (tabValues.length <= MAX_MEMBERS_ALLOWED) {
                tabValues.sort((a, b) => {
                    return a.label > b.label ? 1 : -1
                })
                setRosterMembers(tabValues)

            }
        } else {
            setRosterMembers([])
        }
    }

    return (
        <Container>
            {errorMsg && <Msg error={errorMsg} />}
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
                        <Form.Group>
                            <Form.Label>Raid leader</Form.Label>
                            <Select
                                id="refRaidLeader"
                                options={characters}
                                onChange={setRaidLeader}
                                value={raidLeader}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{rosterMembers && `${pluralize("membre", rosterMembers.length, true)} / ${MAX_MEMBERS_ALLOWED}`}</Form.Label>
                            <Select
                                id="refRosterMembers"
                                isMulti
                                placeholder="Selection des membres..."
                                options={charactersFiltered}
                                onChange={(optionSelected) => handleChange(optionSelected)}
                                value={rosterMembers}
                            />
                        </Form.Group>
                        <UpdateBtn />
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default RosterEdit
