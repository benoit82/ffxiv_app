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
    const style = { height: "40px", width: "40px", margin: "0 auto" }

    function renderTooltip(props) {
        return (
            <Tooltip {...props}>
                {tooltipInfo}
            </Tooltip>
        );
    }

    return (
        <>
            { /* Memo & not purchased */ type === gearType[0] && !lowMemoPurchased &&
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 150, hide: 250 }}
                    overlay={renderTooltip}
                >
                    <img src={Memo} style={style} alt={`${gearType[0]} not OK`} />
                </OverlayTrigger>}
            { /* Memo & purchased */ type === gearType[0] && lowMemoPurchased &&
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 150, hide: 250 }}
                    overlay={renderTooltip}
                >
                    <img src={memoPurchased} style={style} alt={`${gearType[0]} OK`} />
                </OverlayTrigger>}
            { /* loot */ type === gearType[1] &&
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 150, hide: 250 }}
                    overlay={renderTooltip}
                >
                    <img src={Defi} style={style} alt={gearType[1]} />
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
    lowMemoPurchased: PropTypes.bool.isRequired,
    tooltipInfo: PropTypes.string.isRequired,
}

export default ShowGearInfo
