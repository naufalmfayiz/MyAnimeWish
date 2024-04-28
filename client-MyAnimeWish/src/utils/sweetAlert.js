import Swal from "sweetalert2";

export default function sweetAlert(message = "something error") {
  Swal.fire({
    title: "Error!",
    text: message,
    icon: "error",
    confirmButtonText: "Ok",
  });
}
