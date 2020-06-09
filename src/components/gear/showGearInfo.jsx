import React from 'react'
import { gearType } from '../../utils/jobs'
import Memo from '../../img/memo.png'
import Defi from '../../img/defi.png'
import Check from '../../img/check.png'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { OBTAINED } from '../../utils/consts'

const ShowGearInfo = ({ type, tooltipInfo }) => {
    const style = { height: "40px", width: "40px" }

    function renderTooltip(props) {
        return (
            <Tooltip {...props}>
                {tooltipInfo}
            </Tooltip>
        );
    }

    return (
        <>
            { /* Memo */ type === gearType[0] &&
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 150, hide: 250 }}
                    overlay={renderTooltip}
                >
                    <img src={Memo} style={style} alt="Memo" />
                </OverlayTrigger>}
            { /* Memo */ type === gearType[1] &&
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 150, hide: 250 }}
                    overlay={renderTooltip}
                >
                    <img src={Defi} style={style} alt="Loot" />
                </OverlayTrigger>}
            { /* Memo */ type === OBTAINED &&
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 150, hide: 250 }}
                    overlay={renderTooltip}
                >
                    <img src={Check} style={style} alt={OBTAINED} />
                </OverlayTrigger>}
        </>
    )
}

export default ShowGearInfo
