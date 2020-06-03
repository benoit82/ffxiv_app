import React from "react";
import JobListDisplay from "./jobListDisplay";

const jobsTank = [
  {
    value: "DRK",
    label: <JobListDisplay job={"DRK"} />,
  },
  {
    value: "GNB",
    label: <JobListDisplay job={"GNB"} />,
  },
  {
    value: "PLD",
    label: <JobListDisplay job={"PLD"} />,
  },
  {
    value: "WAR",
    label: <JobListDisplay job={"WAR"} />,
  },
];

const jobsHealer = [
  {
    value: "AST",
    label: <JobListDisplay job={"AST"} />,
  },
  {
    value: "SCH",
    label: <JobListDisplay job={"SCH"} />,
  },
  {
    value: "WHM",
    label: <JobListDisplay job={"WHM"} />,
  },
];

const jobsDPS = [
  {
    value: "BRD",
    label: <JobListDisplay job={"BRD"} />,
  },
  {
    value: "BLM",
    label: <JobListDisplay job={"BLM"} />,
  },
  {
    value: "DNC",
    label: <JobListDisplay job={"DNC"} />,
  },
  {
    value: "DRG",
    label: <JobListDisplay job={"DRG"} />,
  },
  {
    value: "MCH",
    label: <JobListDisplay job={"MCH"} />,
  },
  {
    value: "MNK",
    label: <JobListDisplay job={"MNK"} />,
  },
  {
    value: "NIN",
    label: <JobListDisplay job={"NIN"} />,
  },
  {
    value: "RDM",
    label: <JobListDisplay job={"RDM"} />,
  },
  {
    value: "SAM",
    label: <JobListDisplay job={"SAM"} />,
  },
  {
    value: "SMN",
    label: <JobListDisplay job={"SMN"} />,
  },
];

export const selectJobsGroup = [
  {
    label: <JobListDisplay job={"TANKS"} />,
    options: jobsTank,
  },
  {
    label: <JobListDisplay job={"HEALERS"} />,
    options: jobsHealer,
  },
  {
    label: <JobListDisplay job={"DPS"} />,
    options: jobsDPS,
  },
];

/**
 * element choice : Memo (0) or Loot (1)
 */
export const gearType = ["Memo", "Loot"];

/**
 * GearSet :  // (upgrade : only for "Memo" type) - order is for Form builder
 * {
 *  gearPiece: { order, name, type: "Memo" | "Loot", obtained, upgrade: { type: "Weapon" | "Armor" | "Accessory", needed } }
 * }
 */
export const resetGearSet = {
  weapon1: { order: 1, name: "Arme Loot", type: gearType[1], obtained: false },
  weapon2: {
    order: 2,
    name: "Arme Memo",
    type: gearType[0],
    obtained: false,
    upgrade: { type: "Weapon", needed: true },
  },
  head: {
    order: 3,
    name: "Tête",
    type: gearType[0],
    obtained: false,
    upgrade: { type: "Armor", needed: true },
  },
  body: {
    order: 4,
    name: "Torse",
    type: gearType[0],
    obtained: false,
    upgrade: { type: "Armor", needed: true },
  },
  hands: {
    order: 5,
    name: "Mains",
    type: gearType[0],
    obtained: false,
    upgrade: { type: "Armor", needed: true },
  },
  belt: {
    order: 6,
    name: "Ceinture",
    type: gearType[0],
    obtained: false,
    upgrade: { type: "Accessory", needed: true },
  },
  leg: {
    order: 7,
    name: "Jambière",
    type: gearType[0],
    obtained: false,
    upgrade: { type: "Armor", needed: true },
  },
  boots: {
    order: 8,
    name: "Bottes",
    type: gearType[0],
    obtained: false,
    upgrade: { type: "Armor", needed: true },
  },
  earring: {
    order: 9,
    name: "Oreilles",
    type: gearType[0],
    obtained: false,
    upgrade: { type: "Accessory", needed: true },
  },
  neck: {
    order: 10,
    name: "Ras de cou",
    type: gearType[0],
    obtained: false,
    upgrade: { type: "Accessory", needed: true },
  },
  wrist: {
    order: 11,
    name: "Poignet",
    type: gearType[0],
    obtained: false,
    upgrade: { type: "Accessory", needed: true },
  },
  ring1: {
    order: 12,
    name: "Bague Memo",
    type: gearType[0],
    obtained: false,
    upgrade: { type: "Accessory", needed: true },
  },
  ring2: { order: 13, name: "Bague Loot", type: gearType[1], obtained: false },
};
