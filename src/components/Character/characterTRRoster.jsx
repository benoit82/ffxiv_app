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
                        // condition for v1.0.0 users
                        if (gearElement[1].type === gearType[0] && (gearElement[1].lowMemoPurchased === null || gearElement[1].lowMemoPurchased === undefined)) {
                            gearElement[1].lowMemoPurchased = false
                            gearElement[1].upgrade.needed = false
                        }
                        const toolTipInfo = (gearElement[1].type === gearType[0] && !gearElement[1].lowMemoPurchased) ? `${chrDB.name} - ${gearElement[1].name} - non acheté` : `${chrDB.name} - ${gearElement[1].name}`
                        return <td
                            key={gearElement[1].order}
                            onClick={() => obtainedGear(gearElement)}
                            className={cx({ bg_obtained: gearElement[1].obtained })}
                        >
                            {!gearElement[1].obtained && <ShowGearInfo type={gearElement[1].type} lowMemoPurchased={gearElement[1].lowMemoPurchased} tooltipInfo={toolTipInfo} />}
                            {gearElement[1].obtained && <ShowGearInfo type={OBTAINED} tooltipInfo={toolTipInfo} />}
                        </td>
                    })}
            </>}
        </tr>
    )
}

export default CharacterTRRoster
