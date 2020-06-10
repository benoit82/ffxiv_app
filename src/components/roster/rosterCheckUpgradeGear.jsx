import React, { useState, useEffect } from 'react'
import { JOB_PRIORITY_ERR } from '../../utils/consts'
import RosterInfoBadget from './rosterInfoBadget'


const RosterCheckUpgradeGear = ({ members, priorityJob }) => {

    const [upgradeWeapon, setUpgradeWeapon] = useState(0)
    const [upgradeArmor, setUpgradeArmor] = useState(0)
    const [upgradeAccessory, setUpgradeAccessory] = useState(0)
    const [membersNamesForUpgradeWeapon, setMembersNamesForUpgradeWeapon] = useState([])
    const [membersNamesForUpgradeArmor, setMembersNamesForUpgradeArmor] = useState([])
    const [membersNamesForUpgradeAccessory, setMembersNamesForUpgradeAccessory] = useState([])

    useEffect(() => {
        let namesMissingUpgradeWeapon = []
        let namesMissingUpgradeArmor = []
        let namesMissingUpgradeAccessory = []
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
                    throw new Error(JOB_PRIORITY_ERR)
            }
            if (bisJob) {
                Object.entries(bisJob).forEach(gearElement => {
                    if (gearElement[1].upgrade) {
                        switch (gearElement[1].upgrade.type) {
                            case "Weapon":
                                if (gearElement[1].upgrade.needed) {
                                    namesMissingUpgradeWeapon.push(member.name)
                                }
                                break
                            case "Armor":
                                if (gearElement[1].upgrade.needed) {
                                    namesMissingUpgradeArmor.push(member.name)
                                }
                                break
                            case "Accessory":
                                if (gearElement[1].upgrade.needed) {
                                    namesMissingUpgradeAccessory.push(member.name)
                                }
                                break
                            default:
                                break
                        }
                    }
                })
            }
        })
        setUpgradeWeapon(namesMissingUpgradeWeapon.length)
        setUpgradeArmor(namesMissingUpgradeArmor.length)
        setUpgradeAccessory(namesMissingUpgradeAccessory.length)
        // build object for tooltip render
        let objWeapon = {}
        let objArmor = {}
        let objAcces = {}
        namesMissingUpgradeWeapon.forEach((name) => {
            objWeapon[name] = 1 + (objWeapon[name] || 0);
        })
        namesMissingUpgradeArmor.forEach((name) => {
            objArmor[name] = 1 + (objArmor[name] || 0);
        })
        namesMissingUpgradeAccessory.forEach((name) => {
            objAcces[name] = 1 + (objAcces[name] || 0);
        })
        setMembersNamesForUpgradeWeapon(Object.entries(objWeapon))
        setMembersNamesForUpgradeArmor(Object.entries(objArmor))
        setMembersNamesForUpgradeAccessory(Object.entries(objAcces))
    }, [members, priorityJob])

    //TODO : display tooltips + Check BIS update on the component => just 1 job is updated ! (the mainJob)
    return (
        <p className="mr-2">Besoin restant en améliorant :
            <RosterInfoBadget color={"primary"} info={"Agent Renforçant (arme)"} count={upgradeWeapon} tooltipContent={membersNamesForUpgradeWeapon} />
            <RosterInfoBadget color={"success"} info={"Fibre renforcée (armure)"} count={upgradeArmor} tooltipContent={membersNamesForUpgradeArmor} />
            <RosterInfoBadget color={"info"} info={"Agent solidifiant (accessoire)"} count={upgradeAccessory} tooltipContent={membersNamesForUpgradeAccessory} />
        </p>
    )
}

export default RosterCheckUpgradeGear
