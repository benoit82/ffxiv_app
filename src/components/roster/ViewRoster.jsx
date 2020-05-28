import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'

const ViewRoster = () => {
    const { roster_id } = useParams()
    const firebase = useContext(FirebaseContext)

    useEffect(() => {
        // get the roster : - list members (+RL) => wish list

        //open listeners on every wish list

    }, [firebase])

    return (
        <Container>
            coucou view roster {roster_id}
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Membres</th>
                        <th>tête</th>
                        <th>gants</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>ihre</td>
                        <td>Raid</td>
                        <td>Memo+</td>
                    </tr>

                </tbody>
            </Table>
            {/* check if User is RL => give option to manage loot 
            
            - boss list
            - depending boss down : loot list (add)
            - depending loot won : member list needed on job1 and job 2
            - validate > update member wish list as "getted"
            
            */}
        </Container>
    )
}

export default ViewRoster
