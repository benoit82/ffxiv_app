import React from 'react'
import JobListDisplay from './jobListDisplay'

const jobsTank = [
  {
    value: 'DRK',
    label: <JobListDisplay job='DRK' />
  },
  {
    value: 'GNB',
    label: <JobListDisplay job='GNB' />
  },
  {
    value: 'PLD',
    label: <JobListDisplay job='PLD' />
  },
  {
    value: 'WAR',
    label: <JobListDisplay job='WAR' />
  }
]

const jobsHealer = [
  {
    value: 'AST',
    label: <JobListDisplay job='AST' />
  },
  {
    value: 'SGE',
    label: <JobListDisplay job='SGE' />
  },
  {
    value: 'SCH',
    label: <JobListDisplay job='SCH' />
  },
  {
    value: 'WHM',
    label: <JobListDisplay job='WHM' />
  }
]

const jobsDPS = [
  {
    value: 'BRD',
    label: <JobListDisplay job='BRD' />
  },
  {
    value: 'BLM',
    label: <JobListDisplay job='BLM' />
  },
  {
    value: 'DNC',
    label: <JobListDisplay job='DNC' />
  },
  {
    value: 'DRG',
    label: <JobListDisplay job='DRG' />
  },
  {
    value: 'MCH',
    label: <JobListDisplay job='MCH' />
  },
  {
    value: 'MNK',
    label: <JobListDisplay job='MNK' />
  },
  {
    value: 'NIN',
    label: <JobListDisplay job='NIN' />
  },
  {
    value: 'RDM',
    label: <JobListDisplay job='RDM' />
  },
  {
    value: 'SAM',
    label: <JobListDisplay job='SAM' />
  },
  {
    value: 'RPR',
    label: <JobListDisplay job='RPR' />
  },
  {
    value: 'SMN',
    label: <JobListDisplay job='SMN' />
  }
]

export const selectJobsGroup = [
  {
    label: <JobListDisplay job='TANKS' />,
    options: jobsTank
  },
  {
    label: <JobListDisplay job='HEALERS' />,
    options: jobsHealer
  },
  {
    label: <JobListDisplay job='DPS' />,
    options: jobsDPS
  }
]

/**
 *
 * @param {String} job
 * @return {Number} category (0 = unknow, 1 = tank, 2 = healer, 3 = dps)
 */
export const getCategory = (job) => {
  let cat = 0
  cat = jobsTank.some(({value}) => value === job)
    ? 1
    : jobsHealer.some(({value}) => value === job)
      ? 2
      : jobsDPS.some(({value}) => value === job)
        ? 3
        : 0
  return cat
}
/**
 *
 * @param {String | null} job
 * @return {Number} category (0 = unknow, 1 = tank, 2 = healer, 3 = dps)
 */
export const getJobIcon = (job) => {
  if (!job) {
    return 'job inconnu'
  }
  const allJobs = [...jobsDPS, ...jobsHealer, ...jobsTank]
  const icon = allJobs.find((jobObject) => jobObject.value === job)
  return icon ? icon.label : new Error('job non reconnu')
}

/**
 * element choice : Memo (0) or Loot (1)
 */
export const gearType = { memo: 'Memo', loot: 'Loot' }

/**
 * GearSet :  // (upgrade : only for "Memo" type) - order is for Form builder
 * {
 *  gearPiece: { order, name, type: "Memo" | "Loot", obtained, upgrade: { type: "Weapon" | "Armor" | "Accessory", needed } }
 * }
 */
export const resetGearSet = {
  weapon1: {
    order: 1,
    name: 'Arme Loot',
    type: gearType.loot,
    obtained: false
  },
  weapon2: {
    order: 2,
    name: 'Arme Memo',
    type: gearType.memo,
    obtained: false,
    lowMemoPurchased: false,
    upgrade: { type: 'Weapon', needed: false }
  },
  head: {
    order: 3,
    name: 'Tête',
    type: gearType.memo,
    obtained: false,
    lowMemoPurchased: false,
    upgrade: { type: 'Armor', needed: false }
  },
  body: {
    order: 4,
    name: 'Torse',
    type: gearType.memo,
    obtained: false,
    lowMemoPurchased: false,
    upgrade: { type: 'Armor', needed: false }
  },
  hands: {
    order: 5,
    name: 'Mains',
    type: gearType.memo,
    obtained: false,
    lowMemoPurchased: false,
    upgrade: { type: 'Armor', needed: false }
  },
  leg: {
    order: 7,
    name: 'Jambière',
    type: gearType.memo,
    obtained: false,
    lowMemoPurchased: false,
    upgrade: { type: 'Armor', needed: false }
  },
  boots: {
    order: 8,
    name: 'Bottes',
    type: gearType.memo,
    obtained: false,
    lowMemoPurchased: false,
    upgrade: { type: 'Armor', needed: false }
  },
  earring: {
    order: 9,
    name: 'Oreilles',
    type: gearType.memo,
    obtained: false,
    lowMemoPurchased: false,
    upgrade: { type: 'Accessory', needed: false }
  },
  neck: {
    order: 10,
    name: 'Ras de cou',
    type: gearType.memo,
    obtained: false,
    lowMemoPurchased: false,
    upgrade: { type: 'Accessory', needed: false }
  },
  wrist: {
    order: 11,
    name: 'Poignet',
    type: gearType.memo,
    obtained: false,
    lowMemoPurchased: false,
    upgrade: { type: 'Accessory', needed: false }
  },
  ring1: {
    order: 12,
    name: 'Bague Memo',
    type: gearType.memo,
    obtained: false,
    lowMemoPurchased: false,
    upgrade: { type: 'Accessory', needed: false }
  },
  ring2: {
    order: 13,
    name: 'Bague Loot',
    type: gearType.loot,
    obtained: false
  }
}
