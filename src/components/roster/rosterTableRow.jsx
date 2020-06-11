import React, { useContext, useEffect, useState } from 'react'
import CharacterDetailInline from '../character/characterDetailInline'
import { FirebaseContext } from '../firebase';
import { Link } from 'react-router-dom';
import { DeleteBtn } from '../formElements';

const RosterTableRow = ({ roster }) => {
    const { refRaidLeader } = roster
    const firebase = useContext(FirebaseContext)
    const [raidLeader, setRaidLeader] = useState()

    useEffect(() => {
        const setRL = async () => firebase.getDocByRef(refRaidLeader, setRaidLeader)
        setRL()
    }, [firebase, refRaidLeader])

    const handleDelete = (roster) => {
        const confirmation = window.confirm(
            `êtes-vous certain de supprimer ${roster.name} de votre compte ?`
        );
        if (confirmation) {
            firebase.deleteRoster(roster._id);
        }
    };



    return (
        <tr>
            <td>{roster.name}</td>
            <td>
                {raidLeader && <CharacterDetailInline
                    character={raidLeader}
                />}
            </td>
            <td>
                <Link to={`/roster/edit/${roster._id}`} className="btn btn-success"><i className="fas fa-edit"></i>Editer</Link>
                {" "}<Link to={`/roster/view/${roster._id}/1`} className="btn btn-primary"><i className="fas fa-eye"></i>Voir</Link>
                {" "}<DeleteBtn handleClick={() => handleDelete(roster)} />
            </td>
        </tr>
    )
}

export default RosterTableRow
