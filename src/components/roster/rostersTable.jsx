import React from 'react'
import Table from 'react-bootstrap/Table'
import RosterTableRow from './rosterTableRow'

const RostersTable = ({ rosters }) => {
    return (
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Raider Leader</th>
                    <th>Options</th>
                </tr>
            </thead>
            <tbody>
                {rosters.map(roster => <RosterTableRow key={roster._id} roster={roster} />)}
            </tbody>
        </Table>
    )
}

export default RostersTable
