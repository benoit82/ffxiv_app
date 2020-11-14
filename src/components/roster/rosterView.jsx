import React, { useContext, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import { Roster, Character } from '../../models'
import { getCategory } from '../../utils/jobs'
import CharacterTRRoster from '../character/characterTRRoster'
import RosterCheckUpgradeGear from './rosterCheckUpgradeGear'
import { resetGearSet } from '../../utils/jobs'
import Loading from '../loading'
import Button from 'react-bootstrap/Button'
import FFlogsView from './fflogsView'

import './rosterView.scss'
import { showInfoMessage } from '../../utils/globalFunctions'
/**
 * @route /param /roster/view/:roster_id/:jPriority
 */
const RosterView = () => {
    const { roster_id, jPriority } = useParams()
    const history = useHistory()
    const jobPriority = parseInt(jPriority)
    const firebase = useContext(FirebaseContext)
    const [roster, setRoster] = useState(null)
    const [members, setMembers] = useState([])
    const [raidLeader, setRaidLeader] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let unsubscribe = firebase.db
            .collection("rosters")
            .doc(roster_id)
            .onSnapshot(snap => {
                setRoster(new Roster(snap))
                const getRosterData = async (rosterData) => {
                    // manage RL
                    let membersBuilder = []
                    if (rosterData.refRaidLeader) {
                        const chrRL = new Character(await rosterData.refRaidLeader.get())
                        setRaidLeader(chrRL)
                        membersBuilder.push(chrRL)
                    }
                    if (rosterData && rosterData.rosterMembers.length > 0) {
                        rosterData.rosterMembers.forEach(refMember => {
                            const getMemberData = async () => {
                                const chr = new Character(await refMember.get())
                                membersBuilder.push(chr)
                                const nbMembers = rosterData.refRaidLeader ? rosterData.rosterMembers.length + 1 : rosterData.rosterMembers.length
                                if (membersBuilder.length === nbMembers) {
                                    membersBuilder.sort((chr_a, chr_b) => {
                                        const cat_a = getCategory(chr_a.mainJob)
                                        const cat_b = getCategory(chr_b.mainJob)
                                        return cat_a > cat_b ? 1 : -1
                                    })
                                    setMembers(membersBuilder)
                                }
                            }
                            // manage each members
                            getMemberData()
                        })
                    }
                    setMembers(membersBuilder)
                }
                try {
                    getRosterData(snap.data())
                } catch (error) {
                    showInfoMessage("error", "problème de chargement du roster")
                } finally {
                    setLoading(false)
                }
            }
            )
        return () => {
            unsubscribe()
        }
    }, [firebase.db, roster_id])

    return (
        loading ? <Loading />
            : <>
                <Col lg={3}>
                    <div className="custom__container" style={{ position: "sticky" }}>
                        <FFlogsView roster={roster} />
                    </div>
                </Col>
                <Col lg={8}>
                    <div className="custom__container mt-1">
                        <h3>Table des loots</h3>
                        <Table bordered hover variant="dark" className="table_roster">
                            <thead>
                                <tr>
                                    <th>{roster && roster.name}</th>
                                    {Object.entries(resetGearSet)
                                        .sort((gearElement_a, gearElement_b) => gearElement_a[1].order > gearElement_b[1].order ? 1 : -1)
                                        .map(gearElement => {
                                            const thGearName = gearElement[1].name.replace("Loot", "L.").replace("Memo", "M.").replace("Ras de cou", "Cou")
                                            return <th key={gearElement[1].order}>{thGearName}</th>
                                        })}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    members.length > 0 &&
                                    members.map(member => {
                                        let job = null
                                        switch (jobPriority) {
                                            case 1:
                                                job = member.mainJob
                                                break
                                            case 2:
                                                job = member.secondJob
                                                break
                                            case 3:
                                                job = member.thirdJob
                                                break
                                            default:
                                                job = member.mainJob
                                                break
                                        }
                                        return <CharacterTRRoster key={member._id} character={member} job={job} rl={raidLeader} />
                                    })
                                }
                            </tbody>
                        </Table>
                        {members && <RosterCheckUpgradeGear members={members} priorityJob={jobPriority} />}
                        {members.length > 0 && <>
                            <Button variant="danger" className="mr-1" onClick={() => history.push(`/roster/view/${roster_id}/1`)}>Main Job</Button>
                            <Button variant="dark" className="mr-1" onClick={() => history.push(`/roster/view/${roster_id}/2`)}>Job 2</Button>
                            <Button variant="warning" className="mr-1" onClick={() => history.push(`/roster/view/${roster_id}/3`)}>Job 3</Button>
                        </>}
                    </div>
                </Col>
            </>
    )
}

export default RosterView
