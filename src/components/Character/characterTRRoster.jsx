import React, { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../firebase'
import { Character } from '../../models'
import { styleRole } from '../../utils/styleRole'
import { getJobIcon } from '../../utils/jobs'
import { OBTAINED } from '../../utils/consts'
import ShowGearInfo from '../gear/showGearInfo'
import classNames from 'classnames'

import styles from './characterTRRoster.scss'

let cx = classNames.bind(styles)

const CharacterTRRoster = ({ character, job }) => {
    const firebase = useContext(FirebaseContext)
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
    }, [firebase])

    const obtainedGear = (gearNameElement) => {
        const [element, propElement] = gearNameElement
        if (propElement.type === "Memo" && propElement.upgrade) {
            propElement.upgrade.needed = !propElement.upgrade.needed
        }
        let jobBis = { [job]: { ...bis[job], [element]: { ...propElement, obtained: !propElement.obtained } } }
        firebase.updateCharacter(_id, { bis: jobBis })
    }

    return (
        <tr>
            <td style={style}><span>{chrDB.name}</span><div className="avatar_job"><img src={chrDB.avatar} alt={"img"} />{getJobIcon(chrDB.mainJob)}</div></td>
            {bis && bis[job] && <>
                {Object.entries(bis[job])
                    .sort((gearElement_a, gearElement_b) => gearElement_a[1].order > gearElement_b[1].order ? 1 : -1)
                    .map(gearElement => {
                        const toolTipInfo = `${chrDB.name} - ${gearElement[1].name}`
                        return <td
                            key={gearElement[1].order}
                            onClick={() => obtainedGear(gearElement)}
                            className={cx({ bg_obtained: gearElement[1].obtained })}
                        >
                            {!gearElement[1].obtained && <ShowGearInfo type={gearElement[1].type} tooltipInfo={toolTipInfo} />}
                            {gearElement[1].obtained && <ShowGearInfo type={OBTAINED} tooltipInfo={toolTipInfo} />}
                        </td>
                    })}
            </>}
        </tr>
    )
}

export default CharacterTRRoster
