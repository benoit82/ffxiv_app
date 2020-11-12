import React, { useState, useEffect } from 'react'
import RosterInfoBadget from './rosterInfoBadget'
import { gearType } from '../../utils/jobs'
import { PropTypes } from 'prop-types'
import { Character } from '../../models'

const RosterCheckUpgradeGear = ({ members, priorityJob }) => {

    const [upgradeWeapon, setUpgradeWeapon] = useState(0)
    const [upgradeArmor, setUpgradeArmor] = useState(0)
    const [upgradeAccessory, setUpgradeAccessory] = useState(0)
    const [waitersWeap, setWaitersWeap] = useState(0)
    const [waitersArm, setWaitersArm] = useState(0)
    const [waitersAcc, setWaitersAcc] = useState(0)
    const [tooltipBuilderWeap, setTooltipBuilderWeap] = useState([])
    const [tooltipBuilderArm, setTooltipBuilderArm] = useState([])
    const [tooltipBuilderAcc, setTooltipBuilderAcc] = useState([])


    useEffect(() => {

        let namesMissingUpWeap = []
        let namesMissingUpArm = []
        let namesMissingUpAcc = []

        let namesWaiterWeap = []
        let namesWaiterArm = []
        let namesWaiterAcc = []


        members.forEach((member) => {
            let bisJob = null
            switch (priorityJob) {
                case 1:
                    bisJob = member.bis[member.mainJob]
                    break
                case 2:
                    bisJob = member.bis[member.secondJob]
                    break
                case 3:
                    bisJob = member.bis[member.thirdJob]
                    break
                default:
                    bisJob = member.bis[member.mainJob]
            }
            if (bisJob) {
                let bj = Object.entries(bisJob)
                bj.forEach(gearElement => {
                    const checkForGear = (type, tabMbNeedType, tabMbFuturNeed) => {
                        if (gearElement[1].upgrade.type === type) {
                            if (gearElement[1].upgrade.needed) {
                                tabMbNeedType.push(member.name)
                                // else if gear is not obtained and memo not purchased yet
                            }
                            if (gearElement[1].type === gearType[0]
                                && !gearElement[1].obtained
                                && !gearElement[1].lowMemoPurchased) {
                                tabMbFuturNeed.push(member.name)
                            }
                        }
                    }
                    if (gearElement[1].upgrade) {
                        checkForGear("Weapon", namesMissingUpWeap, namesWaiterWeap)
                        checkForGear("Armor", namesMissingUpArm, namesWaiterArm)
                        checkForGear("Accessory", namesMissingUpAcc, namesWaiterAcc)
                    }
                })
            }
        })
        setUpgradeWeapon(namesMissingUpWeap.length)
        setUpgradeArmor(namesMissingUpArm.length)
        setUpgradeAccessory(namesMissingUpAcc.length)

        setWaitersWeap(namesWaiterWeap.length)
        setWaitersArm(namesWaiterArm.length)
        setWaitersAcc(namesWaiterAcc.length)

        // build object for tooltip render
        const countNames = (setterNamesPerType, tabNeed, tabNext) => {
            let need = {}
            let next = {}
            let finalObject = {}

            tabNeed.forEach((name) => {
                need[name] = 1 + (need[name] || 0);
            })

            tabNext.forEach((name) => {
                next[name] = 1 + (next[name] || 0);
            })

            Object.entries(need).forEach(element => finalObject[element[0]] = { ...finalObject[element[0]], need: element[1] })
            Object.entries(next).forEach(element => finalObject[element[0]] = { ...finalObject[element[0]], next: element[1] })


            setterNamesPerType(Object.entries(finalObject))
        }
        countNames(setTooltipBuilderWeap, namesMissingUpWeap, namesWaiterWeap)
        countNames(setTooltipBuilderArm, namesMissingUpArm, namesWaiterArm)
        countNames(setTooltipBuilderAcc, namesMissingUpAcc, namesWaiterAcc)
    }, [members, priorityJob])

    return (
        <p className="mr-2">Besoin restant en améliorant :
            <RosterInfoBadget color={"primary"} info={"Agent Renforçant (arme)"} count={upgradeWeapon} countNext={waitersWeap} tooltipContent={tooltipBuilderWeap} />
            <RosterInfoBadget color={"success"} info={"Fibre renforcée (armure)"} count={upgradeArmor} countNext={waitersArm} tooltipContent={tooltipBuilderArm} />
            <RosterInfoBadget color={"info"} info={"Agent solidifiant (accessoire)"} count={upgradeAccessory} countNext={waitersAcc} tooltipContent={tooltipBuilderAcc} />
        </p>
    )
}
RosterCheckUpgradeGear.propTypes = {
    members: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
    priorityJob: PropTypes.number.isRequired,
}

export default RosterCheckUpgradeGear
