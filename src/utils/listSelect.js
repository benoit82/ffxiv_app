import React from "react";
import JobListDisplay from "./JobListDisplay";

export const jobsTank = [
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
export const jobsHealer = [
  {
    value: "AST",
    label: <JobListDisplay job={"AST"} />,
  },
  {
    value: "SCH",
    label: <JobListDisplay ijob={"SCH"} />,
  },
  {
    value: "WHM",
    label: <JobListDisplay job={"WHM"} />,
  },
];
export const jobsDPS = [
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

export const jobsGroup = [
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
