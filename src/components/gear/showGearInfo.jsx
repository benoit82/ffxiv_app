import React from 'react'
import { gearType } from '../../utils/jobs'
import Memo from '../../img/memo.png'
import Defi from '../../img/defi.png'

const ShowGearInfo = ({ type }) => {
    const style = { height: "40px", width: "40px" }

    return (
        <>
            { /* Memo */ type === gearType[0] && <img src={Memo} style={style} alt="Memo" />}
            { /* Loot */ type === gearType[1] && <img src={Defi} style={style} alt="Loot" />}
        </>
    )
}

export default ShowGearInfo
