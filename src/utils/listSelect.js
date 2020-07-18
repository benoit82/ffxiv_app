import TankIcon from "../img/jobicon/role/TankRole.png";
import HealerIcon from "../img/jobicon/role/HealerRole.png";
import DPSIcon from "../img/jobicon/role/DPSRole.png";

export const jobRole = [
  [
    // TANKS
    {
      backgroundColor: "#2980b9",
      background: `#2980b9 url(${TankIcon}) no-repeat top right`,
    },
    ["DRK", "GNB", "PLD", "WAR"],
  ],
  [
    // HEALERS
    {
      backgroundColor: "#27ae60",
      background: `#27ae60 url(${HealerIcon}) no-repeat top right`,
    },
    ["AST", "SCH", "WHM"],
  ],
  [
    // DPS
    {
      backgroundColor: "#c0392b",
      background: `#c0392b url(${DPSIcon}) no-repeat top right`,
    },
    ["BRD", "BLM", "DNC", "DRG", "MCH", "MNK", "NIN", "RDM", "SAM", "SMN"],
  ],
];
