import React from 'react'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { PropTypes } from 'prop-types'

const RosterInfoBadget = ({ color, info, count, countNext, tooltipContent }) => {
    function renderTooltip(props) {
        return (
            <Tooltip {...props}>
                {tooltipContent && tooltipContent.length > 0 && tooltipContent.map((info, index) => {
                    const need = info[1].need ? info[1].need : 0
                    const next = info[1].next ? info[1].next : 0
                    return <p key={index}>{info[0]} - {need} (+ {next})</p>
                })
                }
            </Tooltip>
        );
    }

    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 150, hide: 250 }}
            overlay={renderTooltip}
        >
            <span className={`badge badge-${color} mr-1`}>{info} <span className="badge badge-pill badge-light">{count} ( + {countNext})</span></span>
        </OverlayTrigger>
    )
}
RosterInfoBadget.propTypes = {
    color: PropTypes.string.isRequired,
    info: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    countNext: PropTypes.number.isRequired,
    tooltipContent: PropTypes.array.isRequired,
}

export default RosterInfoBadget
