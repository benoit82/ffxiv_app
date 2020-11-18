import Swal from 'sweetalert2'

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
