export const FIELD_REQUIRED = "Champ obligatoire.";

// USER
// pseudo
export const PSEUDO_MIN = 3;
export const PSEUDO_MAX = 15;
export const PSEUDO_ERR_MSG = `Le pseudo doit avoir entre ${PSEUDO_MIN} et ${PSEUDO_MAX} lettres.`;

// password
export const PASSWORD_MIN = 6;
export const PASSWORD_ERR_MSG = `Mot de passe trop petit (au moins ${PASSWORD_MIN} caractères).`;
export const PASSWORD_CONF_ERR_MSG = `Mot de passe non conforme.`;

// email
export const EMAIL_ERR_MSG = "Email invalide.";
export const EMAIL_UPDATE_ERR_MSG =
  "Le nouvel email indiqué est le même que l'ancien.";

// CHARACTER
// name
export const CHARACTER_NAME_MIN = 3;
export const CHARACTER_NAME_ERR_MSG = `Au moins ${CHARACTER_NAME_MIN} caractères sont nécessaire pour la recherche.`;

// ROSTER
// name
export const MAX_MEMBERS_ALLOWED = 7;
export const ROSTER_NAME_MIN = 3;
export const ROSTER_NAME_MAX = 20;
export const ROSTER_NAME_ERR_MSG = `Le pseudo doit avoir entre ${ROSTER_NAME_MIN} et ${ROSTER_NAME_MAX} lettres.`;
