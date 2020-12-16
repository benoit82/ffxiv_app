import Axios from 'axios'
import Swal from 'sweetalert2'
import { TWITCH } from './consts'

/**
 *
 * @param {string} type "success" | "error" | "warning" | "info" | "question"
 * @param {string} message
 */
export const showInfoMessage = (type, message) => {
  Swal.fire({
    icon: type,
    text: message
  })
}

/**
 *
 * @param {string} type "success" | "error" | "warning" | "info" | "question"
 * @param {string} message
 * @param {number} timer in ms (2000 by default)
 */
export const toast = (type, message, timer = 2000) => {
  Swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer
  }).fire({
    icon: type,
    text: message
  })
}

export const GetNewTwitchToken = async () => {
  return await Axios.post(
    `${TWITCH.oauthURI}?grant_type=client_credentials&client_id=${process.env.REACT_APP_TWITCH_API_CLIENT_ID}&client_secret=${process.env.REACT_APP_TWITCH_API_SECRET}`
  )
}

function importAll (r) {
  return r.keys().map(r)
}

export const bgImages = importAll(
  require.context('../img/backgrounds/', false, /\.(png|jpe?g|svg)$/)
)
