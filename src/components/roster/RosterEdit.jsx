import React, { useEffect, useState, useContext, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import Msg from '../../utils/msg'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Select from 'react-select'
import Col from 'react-bootstrap/Col'
import * as pluralize from 'pluralize'
import { UpdateBtn } from '../formElements'
import { Character, Roster } from '../../models'



const RosterEdit = () => {
    const { roster_id } = useParams()
    const firebase = useContext(FirebaseContext)

    const MAX_MEMBERS_ALLOWED = 7

    const [roster, setRoster] = useState(new Roster(null))
    const [errorMsg, setErrorMsg] = useState(null)
    const [infoMsg, setInfoMsg] = useState(null)
    const [characters, setCharacters] = useState([])
    //--- select
    const [name, setName] = useState("")
    const [raidLeader, setRaidLeader] = useState({})
    const [charactersFiltered, setCharactersFiltered] = useState([])
    const [rosterMembers, setRosterMembers] = useState([])

    useEffect(() => {
        firebase.getRoster(roster_id, setRoster, setErrorMsg)
        firebase.getAllCharacters(setCharacters, { filter: null })
    }, [])

    const modifRL = useCallback(
        () => {
            findRaidLeader()
            setCharactersFiltered(characters.filter(chr => chr._id !== raidLeader._id))
            setRosterMembers(rosterMembers.filter(chr => chr._id !== raidLeader._id))
        },
        [raidLeader],
    )

    useEffect(() => {
        modifRL()
    }, [raidLeader])

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

    const findRaidLeader = async () => {
        let rl = {}
        if (roster.refRaidLeader) {
            const rlDoc = (await roster.refRaidLeader.get())
            if (rlDoc) rl = new Character(rlDoc)
        }
        if (!raidLeader.value) {
            // on load
            if (characters.some(chr => chr._id === rl._id)) {
                rl = characters.find(chr => chr._id === rl._id)
            }
        } else {
            // on change for raid leader list selected
            if (characters.some(chr => chr._id === raidLeader._id)) {
                rl = characters.find(chr => chr._id === raidLeader._id)
            }
        }
        setRaidLeader(rl)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        // record characters to refs
        let rosterMembersTmp = []
        rosterMembers.forEach(member => {
            rosterMembersTmp = [...rosterMembersTmp, firebase.db.doc(`characters/${member._id}`)]
        })
        if (raidLeader && name) {
            const rosterPayload = {
                ...roster,
                name,
                refRaidLeader: firebase.db.doc(`characters/${raidLeader._id}`),
                rosterMembers: rosterMembersTmp
            }
            delete rosterPayload.value
            delete rosterPayload.label
            try {
                firebase.setRoster(rosterPayload)
                setInfoMsg("Roster mis à jour !")
                setTimeout(() => {
                    setInfoMsg(null)
                }, 1500);
            } catch (error) {
                setErrorMsg(error.message)
            }
        } else {
            setErrorMsg("champs invalides ou non completé")
        }
    }

    // const handleChangeRL = (value) => {
    //     setRaidLeader(value)
    //     // update member option (charactersFiltered) and MembersList (characters) => delete the value

    // }

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

    return (
        <Container>
            {errorMsg && <Msg error={errorMsg} />}
            {infoMsg && <Msg info={infoMsg} />}
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
                                onChange={(optionSelected) => handleChangeMembers(optionSelected)}
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
