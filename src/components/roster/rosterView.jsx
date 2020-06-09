import React, { useContext, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import { Roster, Character } from '../../models'
import { getCategory } from '../../utils/jobs'
import CharacterTRRoster from '../character/characterTRRoster'
import Button from 'react-bootstrap/Button'

/**
 * @route /param /roster/:roster_id
 * @route /admin /roster/:roster_id
 */
const RosterView = () => {
    const { roster_id } = useParams()
    const history = useHistory()
    const firebase = useContext(FirebaseContext)
    const [roster, setRoster] = useState(null)
    const [members, setMembers] = useState([])
    const [raidLeader, setRaidLeader] = useState(null)
    const [infoMsg, setInfoMsg] = useState("")

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
                }).then(
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
                )
            }
            )
        return () => {
            unsubscribe()
        }
    }, [firebase])

    return (
        <Container>
            <Row>
                <h2 className="mr-auto">Table des besoins, roster {roster && roster.name}</h2>
                <Button variant="info" onClick={() => history.goBack()}>
                    <i className="fas fa-long-arrow-alt-left"></i>Retour à la page précèdente</Button>
            </Row>

            <Row className="mt-1">
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>Membres</th>
                            <th>Arme Loot</th>
                            <th>Arme Memo</th>
                            <th>Tête</th>
                            <th>Torse</th>
                            <th>Mains</th>
                            <th>Ceinture</th>
                            <th>Jambière</th>
                            <th>Bottes</th>
                            <th>Oreilles</th>
                            <th>Cou</th>
                            <th>Poignet</th>
                            <th>Bague Memo</th>
                            <th>Bague Loot</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            members && members.length > 0 &&
                            members.map(member => <CharacterTRRoster character={member} />)
                        }
                    </tbody>
                </Table>
            </Row>
            {/* check if User is RL => give option to manage loot 

            - get number of missing loot per item
            
            - boss list
            - depending boss down : loot list (add)
            - depending loot won : member list needed on job1 and job 2
            - validate > update member wish list as "getted"
            
            */}
        </Container>
    )
}

export default RosterView
