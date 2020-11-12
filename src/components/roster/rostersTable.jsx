import React from 'react'
import Table from 'react-bootstrap/Table'
import RosterTableRow from './rosterTableRow'
import { PropTypes } from 'prop-types'
import { Roster } from '../../models'

const RostersTable = ({ rosters }) => {
    return (
        <Table striped bordered hover variant="dark" style={{ maxWidth: "930px" }}>
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
RostersTable.propTypes = {
    rosters: PropTypes.arrayOf(PropTypes.instanceOf(Roster)).isRequired,
}
export default RostersTable
