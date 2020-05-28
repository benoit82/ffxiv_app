import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import Msg from '../../utils/Msg'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Select from 'react-select'
import Col from 'react-bootstrap/Col'
import * as pluralize from 'pluralize'
import { UpdateBtn } from '../formElements'



const RosterEdit = () => {
    const { roster_id } = useParams()
    const firebase = useContext(FirebaseContext)
    const [roster, setRoster] = useState({})
    const [errorMsg, setErrorMsg] = useState(null)
    const [characters, setCharacters] = useState([])

    //--- select state
    const [raidLeader, setRaidLeader] = useState({})
    const [charactersFiltered, setCharactersFiltered] = useState([])
    const [rosterMembers, setRosterMembers] = useState([])

    const { name, refRaidLeader } = roster



    useEffect(() => {
        firebase.getRoster(roster_id, setRoster, setErrorMsg)
        firebase.getAllCharacters(setCharacters)
    }, [])

    useEffect(() => {
        findRaidLeader()
        if (raidLeader.value !== undefined) {
            setCharactersFiltered(characters.filter(chr => chr.value !== raidLeader.value))
        }
    }, [characters, raidLeader])

    const findRaidLeader = () => {
        let rl = {}
        if (!raidLeader.value) {
            // on load
            if (characters.some(chr => chr.value === refRaidLeader)) {
                rl = characters.find(chr => chr.value === refRaidLeader)
            }
        } else {
            // on change for raid leader list selected
            if (characters.some(chr => chr.value === raidLeader.value)) {
                rl = characters.find(chr => chr.value === raidLeader.value)
                // removing raid leader if he has been selected on member list
                setRosterMembers(rosterMembers.filter(chr => chr.value !== raidLeader.value))
            }
        }
        setRaidLeader(rl)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (raidLeader) {
            let rosterMembersCopy = [];
            rosterMembersCopy = rosterMembers.map(chr => [...rosterMembersCopy, chr._id]).flat() // TODO : créer des collections de characters plutot qu'un array ?
            setRoster({ ...roster, refRaidLeader: raidLeader._id, rosterMembers: rosterMembersCopy })
            console.log(roster)
            // TODO find all character with roster id => set to null (field rostermember + roster rl), then update all chrs selected to put the roster id on rostermember/rosterRL
            //firebase.setRoster(roster)
        } else {
            setErrorMsg("Un raid lead doit être désigner.")
        }

    }

    const handleChange = (tabValues) => {
        if (tabValues !== null) {
            if (tabValues.length <= 7) {
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
        <>
            {errorMsg
                ? <Msg error={errorMsg} />
                : <Container>
                    <Row>
                        <h2>Roster : {name}</h2>
                    </Row>
                    <Row>
                        <Col>
                            <Form onSubmit={handleSubmit}>
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
                                    <Form.Label>{rosterMembers.length > 0 ? pluralize("membre", rosterMembers.length, true) : "aucun membre associé"}</Form.Label>
                                    <Select
                                        id="refRosterMembers"
                                        isMulti
                                        options={charactersFiltered}
                                        onChange={(optionSelected) => handleChange(optionSelected)}
                                        defaultValue={rosterMembers}
                                        value={rosterMembers}
                                    />
                                </Form.Group>
                                <UpdateBtn />
                            </Form>
                        </Col>
                    </Row>


                </Container>
            }
        </>
    )
}

export default RosterEdit
