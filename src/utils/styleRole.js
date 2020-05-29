import { jobRole } from "./listSelect";

/**
 *
 * @param {String} job
 * @returns {{backgroundColor,background}} styleConfig
 */
export const styleRole = (job) => {
  let style = {};
  if (job) {
    jobRole.forEach((role) => {
      if (role[1].includes(job)) style = role[0];
    });
  } else {
    style = { backgroundColor: "#bdc3c7", background: "no-repeat top right" };
  }
  return style;
};
