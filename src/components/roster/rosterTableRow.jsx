import React, { useContext, useEffect, useState } from 'react'
import CharacterDetailInline from '../character/characterDetailInline'
import { FirebaseContext } from '../firebase'
import { Link } from 'react-router-dom'
import { DeleteBtn } from '../formElements'
import Swal from 'sweetalert2'
import { PropTypes } from 'prop-types'
import { Roster } from '../../models'

const RosterTableRow = ({ roster }) => {
  const { refRaidLeader } = roster
  const firebase = useContext(FirebaseContext)
  const [raidLeader, setRaidLeader] = useState()

  const handleDelete = async (roster) => {
    const confirmation = await Swal.fire({
      icon: 'warning',
      html: `êtes-vous certain de supprimer le roster : ${roster.name} ?`,
      cancelButtonText: 'annuler',
      showCancelButton: true,
      confirmButtonText: 'oui, certain'
    })
    if (confirmation.value) {
      firebase.deleteRoster(roster._id)
      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true
      })
      Toast.fire({
        icon: 'success',
        title: `${roster.name} supprimé !`
      })
    }
  }

  useEffect(() => {
    if (refRaidLeader) {
      const setRL = async () => firebase.getDocByRef(refRaidLeader, setRaidLeader)
      setRL()
    }
  }, [firebase, refRaidLeader])

  return (
    <tr>
      <td>{roster.name}</td>
      <td>
        {raidLeader ? <CharacterDetailInline
          character={raidLeader}
                      /> : <p>Roster temporaire</p>}
      </td>
      <td>
        <Link to={`/roster/edit/${roster._id}`} className='btn btn-success'><i className='fas fa-edit' />Editer</Link>
        {' '}<Link to={`/roster/view/${roster._id}/1`} className='btn btn-primary'><i className='fas fa-eye' />Voir</Link>
        {' '}<DeleteBtn handleClick={() => handleDelete(roster)} />
      </td>
    </tr>
  )
}
RosterTableRow.propTypes = {
  roster: PropTypes.instanceOf(Roster).isRequired
}
export default RosterTableRow
