import Swal from "sweetalert2";

/**
 *
 * @param {string} type "success" | "error" | "warning" | "info" | "question"
 * @param {string} message
 */
export const showInfoMessage = (type, message) => {
  Swal.fire({
    icon: type,
    text: message,
  });
};
