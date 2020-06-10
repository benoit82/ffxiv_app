import React from 'react'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

const RosterInfoBadget = ({ color, info, count, tooltipContent }) => {

    function renderTooltip(props) {
        return (
            <Tooltip {...props}>
                {tooltipContent && tooltipContent.length > 0 && tooltipContent.map((info, index) => <p key={index}>{info[0]} - {info[1]}</p>)}
            </Tooltip>
        );


    }

    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 150, hide: 250 }}
            overlay={renderTooltip}
        >
            <span className={`badge badge-${color} mr-1`}>{info} <span className="badge badge-pill badge-light">{count}</span></span>
        </OverlayTrigger>
    )
}

export default RosterInfoBadget
