import React, { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../firebase'
import { Character } from '../../models'
import { styleRole } from '../../utils/styleRole'
import { getJobIcon } from '../../utils/jobs'

import './characterTRRoster.scss'

const CharacterTRRoster = ({ character }) => {
    const firebase = useContext(FirebaseContext)
    const { _id } = character
    const [chrDB, setChrDB] = useState(character)
    const { bis } = chrDB
    const style = styleRole(chrDB.mainJob)

    useEffect(() => {
        let unsubscribe = firebase.db
            .collection("characters")
            .doc(_id)
            .onSnapshot(snap => {
                setChrDB(new Character(snap))
            })

        return () => {
            unsubscribe()
        }
    }, [firebase])



    return (
        <tr>
            <td style={style}><span>{chrDB.name}</span><div className="avatar_job"><img src={chrDB.avatar} alt={"img"} />{getJobIcon(chrDB.mainJob)}</div></td>
            {bis && bis[chrDB.mainJob] && <>
                <td>{bis[chrDB.mainJob].weapon1.type}</td>
                <td>{bis[chrDB.mainJob].weapon2.type}</td>
                <td>{bis[chrDB.mainJob].head.type}</td>
                <td>{bis[chrDB.mainJob].body.type}</td>
                <td>{bis[chrDB.mainJob].hands.type}</td>
                <td>{bis[chrDB.mainJob].belt.type}</td>
                <td>{bis[chrDB.mainJob].leg.type}</td>
                <td>{bis[chrDB.mainJob].boots.type}</td>
                <td>{bis[chrDB.mainJob].earring.type}</td>
                <td>{bis[chrDB.mainJob].neck.type}</td>
                <td>{bis[chrDB.mainJob].wrist.type}</td>
                <td>{bis[chrDB.mainJob].ring1.type}</td>
                <td>{bis[chrDB.mainJob].ring2.type}</td>
            </>}
        </tr>
    )
}

export default CharacterTRRoster
