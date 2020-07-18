import React, { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../firebase'
import { UserApi } from '../../utils/appContext'
import { Character } from '../../models'
import { styleRole } from '../../utils/styleRole'
import { getJobIcon, gearType } from '../../utils/jobs'
import { OBTAINED } from '../../utils/consts'
import ShowGearInfo from '../gear/showGearInfo'
import classNames from 'classnames'

import styles from './characterTRRoster.scss'

let cx = classNames.bind(styles)

const CharacterTRRoster = ({ character, job, rl }) => {

    const firebase = useContext(FirebaseContext)
    const { user } = useContext(UserApi)
    const { _id } = character
    const [chrDB, setChrDB] = useState(character)
    const { bis } = chrDB
    const style = styleRole(job)

    useEffect(() => {
        let unsubscribe = firebase.db
            .collection("characters")
            .doc(_id)
            .onSnapshot(snap => setChrDB(new Character(snap)))
        return () => {
            unsubscribe()
        }
    }, [_id, firebase.db])

    const obtainedGear = (gearNameElement) => {
        // check if the user is admin or rl or user's character owner
        let rlId = rl ? rl._id : null
        if (user.isAdmin || user.characters.some(chrRef => chrRef.id === rlId) || chrDB.userRef.id === user.uid) {
            const [element, propElement] = gearNameElement
            //if the character's owner click, and confirm, on non-buy memo => set memo purchased and stop
            if (chrDB.userRef.id === user.uid
                && propElement.type === gearType[0]
                && !propElement.lowMemoPurchased
                && window.confirm(`Confirmation de l'achat en ${gearType[0]} : ${propElement.name}`)) {
                propElement.lowMemoPurchased = true
                propElement.upgrade.needed = true
                let jobBis = { ...character.bis, [job]: { ...bis[job], [element]: { ...propElement } } }
                firebase.updateCharacter(_id, { bis: jobBis })
                return
            }
            switch (propElement.type) {
                case gearType[0]:
                    if (propElement.upgrade && propElement.lowMemoPurchased) {
                        propElement.upgrade.needed = !propElement.upgrade.needed
                    }
                    propElement.obtained = !propElement.lowMemoPurchased ? false : !propElement.obtained
                    break;
                case gearType[1]:
                    propElement.obtained = !propElement.obtained
                    break;
                default:
                    return;
            }
            let jobBis = { ...character.bis, [job]: { ...bis[job], [element]: { ...propElement } } }
            firebase.updateCharacter(_id, { bis: jobBis })
        }
    }

    return (
        <tr>
            <td style={style}><span>{chrDB.name}</span><div className="avatar_job"><img src={chrDB.avatar} alt={"img"} />{job ? getJobIcon(job) : "job à déterminer"}</div></td>
            {bis && bis[job] && <>
                {Object.entries(bis[job])
                    .sort((gearElement_a, gearElement_b) => gearElement_a[1].order > gearElement_b[1].order ? 1 : -1)
                    .map(gearElement => {
                        let { type, lowMemoPurchased, order, obtained, upgrade } = gearElement[1]
                        // condition for v1.0.0 users
                        if (type === gearType[0] && (lowMemoPurchased === null || lowMemoPurchased === undefined)) {
                            lowMemoPurchased = false
                            upgrade.needed = false
                        }
                        const toolTipInfo = (type === gearType[0] && !lowMemoPurchased) ? `${chrDB.name} - ${gearElement[1].name} - non acheté` : `${chrDB.name} - ${gearElement[1].name}`
                        return <td
                            key={order}
                            onClick={() => obtainedGear(gearElement)}
                            className={cx({ bg_obtained: obtained })}
                        >
                            {obtained ?
                                <ShowGearInfo type={OBTAINED} tooltipInfo={toolTipInfo} />
                                : <ShowGearInfo type={type} lowMemoPurchased={lowMemoPurchased} tooltipInfo={toolTipInfo} />
                            }
                        </td>
                    })}
            </>}
        </tr>
    )
}

export default CharacterTRRoster
