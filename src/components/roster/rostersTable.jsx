import React from 'react'
import Table from 'react-bootstrap/Table'
import CharacterDetailInline from '../character/characterDetailInline'
import { Link } from 'react-router-dom'
import { DeleteBtn } from '../formElements'

const RostersTable = ({ rosters, findCharacter, handleDelete }) => {
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
                {rosters.map((roster, index) => (
                    <tr key={index}>
                        <td>{roster.name}</td>
                        <td>
                            <CharacterDetailInline
                                character={findCharacter(roster.refRaidLeader)}
                            />
                        </td>
                        <td>
                            {/* ! TODO editer roster */}
                            <Link to={`/roster/edit/${roster._id}`} className="btn btn-success"><i className="fas fa-edit"></i>Editer</Link>
                            {" "}<Link to={`/roster/${roster._id}`} className="btn btn-primary"><i className="fas fa-eye"></i>Voir</Link>
                            {" "}<DeleteBtn handleClick={() => handleDelete(roster)} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}

export default RostersTable
