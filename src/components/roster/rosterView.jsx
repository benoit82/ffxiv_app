import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import { Roster, Character } from '../../models'
import { getCategory } from '../../utils/jobs'
import CharacterTRRoster from '../character/characterTRRoster'
import RosterCheckUpgradeGear from './rosterCheckUpgradeGear'
import { resetGearSet } from '../../utils/jobs'

import './rosterView.scss'

/**
 * @route /param /roster/:roster_id
 * @route /admin /roster/:roster_id
 */
const RosterView = () => {
    const { roster_id } = useParams()
    const firebase = useContext(FirebaseContext)
    const [roster, setRoster] = useState(null)
    const [members, setMembers] = useState([])
    const [raidLeader, setRaidLeader] = useState(null)
    const [value, setValue] = useState(0);

    useEffect(() => {
        let unsubscribe = firebase.db
            .collection("rosters")
            .doc(roster_id)
            .onSnapshot(snap => {
                setRoster(new Roster(snap))
                const rosterData = snap.data()
                let membersBuilder = []
                // manage RL
                rosterData.refRaidLeader.get().then(resp => {
                    const chrRL = new Character(resp)
                    setRaidLeader(chrRL)
                    membersBuilder.push(chrRL)
                }).then(() => {
                    if (rosterData && rosterData.rosterMembers.length > 0) {
                        // manage each members
                        rosterData.rosterMembers.forEach(refMember => {
                            refMember.get().then(resp => {
                                const chr = new Character(resp)
                                membersBuilder.push(chr)
                            }).then(() => {
                                if (membersBuilder.length === rosterData.rosterMembers.length + 1) {
                                    membersBuilder.sort((chr_a, chr_b) => {
                                        const cat_a = getCategory(chr_a.mainJob)
                                        const cat_b = getCategory(chr_b.mainJob)
                                        return cat_a > cat_b ? 1 : -1
                                    })
                                    setMembers(membersBuilder)
                                }
                            })
                        })
                    } else {
                        setMembers(membersBuilder)
                    }

                }

                )
            }
            )
        return () => {
            unsubscribe()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const rerender = (e) => {
        if (e.target.nodeName === "IMG" || e.target.nodeName === "TD") {
            setValue(value => ++value); // force rerender for upgrade component
        }
    }

    return (
        <Container>
            <Row className="mt-1">
                <Table striped bordered hover variant="dark" className="table_roster">
                    <thead>
                        <tr>
                            <th>Membres : {roster && roster.name}</th>
                            {Object.entries(resetGearSet)
                                .sort((gearElement_a, gearElement_b) => gearElement_a[1].order > gearElement_b[1].order ? 1 : -1)
                                .map(gearElement => {
                                    const thGearName = gearElement[1].name.replace("Loot", "L.").replace("Memo", "M.").replace("Ras de cou", "Cou")
                                    return <th key={gearElement[1].order}>{thGearName}</th>
                                })}
                        </tr>
                    </thead>
                    <tbody onClick={rerender}>
                        {
                            members && members.length > 0 &&
                            members.map(member => <CharacterTRRoster key={member._id} character={member} job={member.mainJob} />)
                        }
                    </tbody>
                </Table>
            </Row>
            {members && members.length > 0 && <Row>
                <RosterCheckUpgradeGear members={members} priorityJob={1} />
            </Row>}
        </Container>
    )
}

export default RosterView
