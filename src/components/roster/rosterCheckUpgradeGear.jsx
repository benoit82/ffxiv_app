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
    const namesMissingUpWeap = []
    const namesMissingUpArm = []
    const namesMissingUpAcc = []

    const namesWaiterWeap = []
    const namesWaiterArm = []
    const namesWaiterAcc = []

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
        const bj = Object.values(bisJob)
        // member.memoGearUpgrades = bj.reduce((res, currentGearElement) => {
        //   if (currentGearElement.type === gearType.memo && currentGearElement.upgrade.needed) {
        //     const { type } = currentGearElement.upgrade
        //     if (currentGearElement.lowMemoPurchased) {
        //       res[type] = res[type] ? ++res[type] : 1
        //     }
        //   }
        //   return res
        // }, {})
        bj.forEach(gearElement => {
          const checkForGear = (type, tabMbNeedType, tabMbFuturNeed) => {
            if (gearElement.upgrade.type === type) {
              if (gearElement.upgrade.needed) {
                tabMbNeedType.push(member.name)
                // else if gear is not obtained and memo not purchased yet
              }
              if (gearElement.type === gearType.memo &&
                !gearElement.obtained &&
                !gearElement.lowMemoPurchased) {
                tabMbFuturNeed.push(member.name)
              }
            }
          }
          if (gearElement.upgrade) {
            checkForGear('Weapon', namesMissingUpWeap, namesWaiterWeap)
            checkForGear('Armor', namesMissingUpArm, namesWaiterArm)
            checkForGear('Accessory', namesMissingUpAcc, namesWaiterAcc)
          }
        })
      }
    })

    // const upgradeGlobalNeeded = members.reduce((res, currentMember) => {
    //   const { name } = currentMember
    //   if (currentMember.memoGearUpgrades) {
    //     Object.entries(currentMember.memoGearUpgrades).forEach(type => {
    //       console.log(type)
    //       if (res[type[0]]) {
    //         res[type[0]].total = res[type[0]].total + type[1]
    //         res[type[0]].names = [...res[type[0]].names, name]
    //       } else {
    //         res[type[0]] = { total: type[1], names: [name] }
    //       }
    //     })
    //   }
    //   return res
    // }, {})

    // console.log('upgradeGlobalNeeded :>> ', upgradeGlobalNeeded)

    setUpgradeWeapon(namesMissingUpWeap.length)
    setUpgradeArmor(namesMissingUpArm.length)
    setUpgradeAccessory(namesMissingUpAcc.length)

    setWaitersWeap(namesWaiterWeap.length)
    setWaitersArm(namesWaiterArm.length)
    setWaitersAcc(namesWaiterAcc.length)

    // build object for tooltip render
    const countNames = (setterNamesPerType, tabNeed, tabNext) => {
      const need = {}
      const next = {}
      const finalObject = {}

      tabNeed.forEach((name) => {
        need[name] = 1 + (need[name] || 0)
      })

      tabNext.forEach((name) => {
        next[name] = 1 + (next[name] || 0)
      })

      Object.entries(need).forEach(element => { finalObject[element[0]] = { ...finalObject[element[0]], need: element[1] } })
      Object.entries(next).forEach(element => { finalObject[element[0]] = { ...finalObject[element[0]], next: element[1] } })

      setterNamesPerType(Object.entries(finalObject))
    }
    countNames(setTooltipBuilderWeap, namesMissingUpWeap, namesWaiterWeap)
    countNames(setTooltipBuilderArm, namesMissingUpArm, namesWaiterArm)
    countNames(setTooltipBuilderAcc, namesMissingUpAcc, namesWaiterAcc)
  }, [members, priorityJob])

  return (
    <p className='mr-2'>Besoin restant en améliorant :
      <RosterInfoBadget color='primary' info='Agent Renforçant (arme)' count={upgradeWeapon} countNext={waitersWeap} tooltipContent={tooltipBuilderWeap} />
      <RosterInfoBadget color='success' info='Fibre renforcée (armure)' count={upgradeArmor} countNext={waitersArm} tooltipContent={tooltipBuilderArm} />
      <RosterInfoBadget color='info' info='Agent solidifiant (accessoire)' count={upgradeAccessory} countNext={waitersAcc} tooltipContent={tooltipBuilderAcc} />
    </p>
  )
}
RosterCheckUpgradeGear.propTypes = {
  members: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
  priorityJob: PropTypes.number.isRequired
}

export default RosterCheckUpgradeGear
