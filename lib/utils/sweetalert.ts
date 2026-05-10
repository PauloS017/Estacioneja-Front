import Swal from "sweetalert2"

interface AlertProps {
  title: string
  text?: string
  confirmButtonText?: string
  cancelButtonText?: string
  confirmButtonColor?: string
  cancelButtonColor?: string
}

export const defaultAlert = {
  error: (body: AlertProps) => Swal.fire({ ...body, icon: "error" }),
  success: (body: AlertProps) => Swal.fire({ ...body, icon: "success" }),
  info: (body: AlertProps) => Swal.fire({ ...body, icon: "info" }),
}

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

export const confirmDialog = (title: string, text: string, confirmText: string = 'Sim, continuar') => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#059669',
    cancelButtonColor: '#ef4444', 
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar'
  })
}
