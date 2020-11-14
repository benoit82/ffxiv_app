import React, { useState, useEffect } from 'react'
import { styleRole } from "./styleRole"
import { PropTypes } from "prop-types"
//--Jobs Icon
import DarkKnightIcon from "../img/jobicon/tank/DarkKnight.png"
import GunbreakerIcon from "../img/jobicon/tank/Gunbreaker.png"
import PaladinIcon from "../img/jobicon/tank/Paladin.png"
import WarriorIcon from "../img/jobicon/tank/Warrior.png"
import AstrologianIcon from "../img/jobicon/healer/Astrologian.png"
import ScholarIcon from "../img/jobicon/healer/Scholar.png"
import WhiteMageIcon from "../img/jobicon/healer/WhiteMage.png"
import BardIcon from "../img/jobicon/dps/Bard.png"
import BlackMageIcon from "../img/jobicon/dps/BlackMage.png"
import DancerIcon from "../img/jobicon/dps/Dancer.png"
import DragoonIcon from "../img/jobicon/dps/Dragoon.png"
import MachinistIcon from "../img/jobicon/dps/Machinist.png"
import MonkIcon from "../img/jobicon/dps/Monk.png"
import NinjaIcon from "../img/jobicon/dps/Ninja.png"
import RedMageIcon from "../img/jobicon/dps/RedMage.png"
import SamuraiIcon from "../img/jobicon/dps/Samurai.png"
import SummonerIcon from "../img/jobicon/dps/Summoner.png"
//--Role Icon
import TankIcon from "../img/jobicon/role/TankRole.png"
import HealerIcon from "../img/jobicon/role/HealerRole.png"
import DPSIcon from "../img/jobicon/role/DPSRole.png"

const JobListDisplay = ({ job }) => {

    const [imgSrc, setImgSrc] = useState(TankIcon)
    const [jobStyleRole, setJobStyleRole] = useState({ backgroundColor: "#000" })

    useEffect(() => {
        jobBuilder(job)
        setJobStyleRole(styleRole(job))
    }, [job])

    const jobBuilder = (job) => {
        switch (job) {
            case "TANKS":
                setImgSrc(TankIcon)
                break;
            case "HEALERS":
                setImgSrc(HealerIcon)
                break;
            case "DPS":
                setImgSrc(DPSIcon)
                break;
            case "DRK":
                setImgSrc(DarkKnightIcon)
                break;
            case "GNB":
                setImgSrc(GunbreakerIcon)
                break;
            case "PLD":
                setImgSrc(PaladinIcon)
                break;
            case "WAR":
                setImgSrc(WarriorIcon)
                break;
            case "AST":
                setImgSrc(AstrologianIcon)
                break;
            case "SCH":
                setImgSrc(ScholarIcon)
                break;
            case "WHM":
                setImgSrc(WhiteMageIcon)
                break;
            case "BRD":
                setImgSrc(BardIcon)
                break;
            case "BLM":
                setImgSrc(BlackMageIcon)
                break;
            case "DNC":
                setImgSrc(DancerIcon)
                break;
            case "DRG":
                setImgSrc(DragoonIcon)
                break;
            case "MCH":
                setImgSrc(MachinistIcon)
                break;
            case "MNK":
                setImgSrc(MonkIcon)
                break;
            case "NIN":
                setImgSrc(NinjaIcon)
                break;
            case "RDM":
                setImgSrc(RedMageIcon)
                break;
            case "SAM":
                setImgSrc(SamuraiIcon)
                break;
            case "SMN":
                setImgSrc(SummonerIcon)
                break;
            default:
                setImgSrc(TankIcon)
                break;
        }
    }


    return (
        <div className="icon_label" style={{ backgroundColor: jobStyleRole.backgroundColor }}>
            <img style={{ width: "1.5em", height: "1.5em", marginRight: "5px" }} src={imgSrc} alt={job} />
            <span style={{ fontWeight: "bolder" }}>{job}</span>
        </div>
    )
}
JobListDisplay.propTypes = {
    job: PropTypes.string.isRequired
}
export default JobListDisplay
