import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }


  SuccessAlert(message: string){
    Swal.fire({
      title: `${message}con éxito!`,
      icon: 'success',
      confirmButtonText: 'OK',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary px-4',
      },
    });
  }

  ErrorAlert(message:string){
    Swal.fire({
      title: `${message}`,
      icon: 'error',
      confirmButtonText: 'OK',
      buttonsStyling: true,

      customClass: {
        confirmButton: 'btn btn-primary px-4',
      },
    });
  }


  DeleteAlert(message: string ="¿Deseas eliminar el registro?"):Promise<any>{
    return Swal.fire({
      title: message,
      text: "Esta acción no se podrá revertir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, Eliminar!",
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary px-4',
        cancelButton: 'btn btn-danger ms-2 px-4',
      },
    });
  }

}
