import React, { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../firebase'
import { UserApi } from '../../utils/appContext'
import { Character } from '../../models'
import { styleRole } from '../../utils/styleRole'
import { getJobIcon, gearType } from '../../utils/jobs'
import { OBTAINED } from '../../utils/consts'
import ShowGearInfo from '../gear/showGearInfo'
import classNames from 'classnames'
import Swal from 'sweetalert2'
import { PropTypes } from 'prop-types'

import styles from './characterTRRoster.scss'

const cx = classNames.bind(styles)

const CharacterTRRoster = ({ character, job, rl, currentPatch }) => {
  const firebase = useContext(FirebaseContext)
  const { user } = useContext(UserApi)
  const { _id } = character
  const [chrDB, setChrDB] = useState(character)
  const { bis } = chrDB
  const style = styleRole(job)

  const obtainedGear = async (gearNameElement) => {
    // check if the user is admin or rl or user's character owner
    const rlId = rl ? rl._id : null
    if (user.isAdmin || user.characters.some(chrRef => chrRef.id === rlId) || chrDB.userRef.id === user.uid) {
      const [element, propElement] = gearNameElement
      // if the character's owner click, and confirm, on non-buy memo => set memo purchased and stop
      if (chrDB.userRef.id === user.uid &&
        propElement.type === gearType.memo &&
        !propElement.lowMemoPurchased
      ) {
        const confirmation = await Swal.fire({
          title: "confirmation d'achat",
          html: `Confirmation de l'achat en ${gearType.memo.toLowerCase()} : ${propElement.name}`,
          cancelButtonText: 'annuler',
          showCancelButton: true,
          confirmButtonText: 'oui',
          icon: 'info'
        })
        if (confirmation.value) {
          propElement.lowMemoPurchased = true
          propElement.upgrade.needed = true
          const jobBis = { ...character.bis, [job]: { ...bis[job], [element]: { ...propElement } } }
          firebase.updateCharacter(_id, { bis: jobBis })
          const Toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true
          })
          Toast.fire({
            icon: 'success',
            title: 'Achat confirmé !'
          })
        }

        return
      }
      switch (propElement.type) {
        case gearType.memo:
          if (propElement.upgrade && propElement.lowMemoPurchased) {
            propElement.upgrade.needed = !propElement.upgrade.needed
          }
          propElement.obtained = !propElement.lowMemoPurchased ? false : !propElement.obtained
          break
        case gearType.loot:
          propElement.obtained = !propElement.obtained
          break
        default:
          return
      }
      const jobBis = { ...character.bis, [job]: { ...bis[job], [element]: { ...propElement } } }
      firebase.updateCharacter(_id, { bis: jobBis })
    }
  }

  useEffect(() => {
    const unsubscribe = firebase.db
      .collection('characters')
      .doc(_id)
      .onSnapshot(snap => setChrDB(new Character(snap)))
    return () => {
      unsubscribe()
    }
  }, [_id, firebase.db])

  return (
    <tr>
      <td className='chr_table_detail' style={style}>
        <span style={{ backgroundColor: chrDB.BISPatch === currentPatch ? 'transparent' : '#660000', paddingLeft: '3px' }}>{chrDB.name} - BIS {chrDB.BISPatch}</span>
        <div className='avatar_job'>
          <img src={chrDB.avatar} alt='img' />
          {getJobIcon(job)}
        </div>
      </td>
      {bis && bis[job] &&
        <>
          {Object.entries(bis[job])
            .sort((gearElementA, gearElementB) => gearElementA[1].order > gearElementB[1].order ? 1 : -1)
            .map(gearElement => {
              let { type, lowMemoPurchased, order, obtained, upgrade } = gearElement[1]
              // condition for v1.0.0 users
              if (type === gearType.memo && !lowMemoPurchased) {
                lowMemoPurchased = false
                upgrade.needed = false
              }
              const toolTipInfo = (type === gearType.memo && !lowMemoPurchased) ? `${chrDB.name} - ${gearElement[1].name} - non acheté` : `${chrDB.name} - ${gearElement[1].name}`
              return (
                <td
                  key={order}
                  onClick={() => obtainedGear(gearElement)}
                  className={cx({ bg_obtained: obtained })}
                >
                  {obtained
                    ? <ShowGearInfo type={OBTAINED} tooltipInfo={toolTipInfo} />
                    : <ShowGearInfo type={type} lowMemoPurchased={lowMemoPurchased} tooltipInfo={toolTipInfo} />}
                </td>
              )
            })}
        </>}
    </tr>
  )
}
CharacterTRRoster.propTypes = {
  character: PropTypes.instanceOf(Character).isRequired,
  job: PropTypes.string,
  rl: PropTypes.instanceOf(Character).isRequired
}
export default CharacterTRRoster
