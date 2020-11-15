import React from 'react'
import { gearType } from '../../utils/jobs'
import Memo from '../../img/memo.png'
import memoPurchased from '../../img/memoPurchased.png'
import Defi from '../../img/defi.png'
import Check from '../../img/check.png'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { OBTAINED } from '../../utils/consts'
import { PropTypes } from 'prop-types'

const ShowGearInfo = ({ type, lowMemoPurchased, tooltipInfo }) => {
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
            { /* Memo & not purchased */ type === gearType.memo && !lowMemoPurchased &&
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 150, hide: 250 }}
                    overlay={renderTooltip}
                >
                    <img src={Memo} style={style} alt={`${gearType.memo} not OK`} />
                </OverlayTrigger>}
            { /* Memo & purchased */ type === gearType.memo && lowMemoPurchased &&
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 150, hide: 250 }}
                    overlay={renderTooltip}
                >
                    <img src={memoPurchased} style={style} alt={`${gearType.memo} OK`} />
                </OverlayTrigger>}
            { /* loot */ type === gearType.loot &&
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 150, hide: 250 }}
                    overlay={renderTooltip}
                >
                    <img src={Defi} style={style} alt={gearType.loot} />
                </OverlayTrigger>}
            { /* obtained */ type === OBTAINED &&
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
ShowGearInfo.propTypes = {
    type: PropTypes.string.isRequired,
    lowMemoPurchased: PropTypes.bool,
    tooltipInfo: PropTypes.string.isRequired,
}

export default ShowGearInfo
