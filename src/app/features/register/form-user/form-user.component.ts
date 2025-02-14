import { Component, OnInit } from '@angular/core';
import { User } from '../../Security/users/User.module';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../Security/users/user.service';
import { AlertService } from '../../../shared/components/alert.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.css'] // Cambié a styleUrls
})
export class FormUserComponent implements OnInit {

  Users: User[] = [];
  selectedFile: File | null = null;


  personId: number | null = null; // Inicializado como null
  newUser: any = {
    id: 0,
    password: '',
    username: '',
    personId: 0,
    photo: null
  }
  passwordError: string = ''; // Mensaje de error de contraseña

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private alertService: AlertService) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.personId = +params['personId']; // Asegúrate de convertirlo a número
    });

  }

  validatePassword(): void {
    const password = this.newUser.password;
    // Expresión regular para verificar al menos un número y un símbolo @ ! / &
    const regex = /^(?=.*[0-9])(?=.*[@!/&]).{3,15}$/;

    if (!regex.test(password)) {
      this.passwordError = 'La contraseña debe contener al menos un número y uno de los siguientes símbolos: @ ! / &';
    } else {
      this.passwordError = '';
    }
  }

  fileError: string | null = null; // Variable para manejar mensajes de error

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const validFormats = ['image/jpeg', 'image/jpg'];
      if (!validFormats.includes(file.type)) {
        this.fileError = 'Solo se permiten archivos JPG o JPEG.';
        this.newUser.photo = null; // Limpia cualquier imagen previa cargada
        event.target.value = ''; // Resetea el input de archivo
        return;
      }
  
      // Si el archivo es válido, continúa con la carga
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.newUser.photo = base64String.split(',')[1]; // Elimina el prefijo "data:image/..."
        this.fileError = null; // Limpia mensajes de error
      };
      reader.readAsDataURL(file); // Convierte la imagen a Base64
    }
  }
  
  

  isButtonDisabled: boolean = false;
  isLoading: boolean = false;

  onSubmit(form: NgForm): void {
    this.isButtonDisabled = true; // Deshabilita el botón
    this.isLoading = true; // Activa el spinner si corresponde

    if (this.personId !== null) {
      this.newUser.personId = this.personId;

      this.userService.createUser(this.newUser).subscribe({
        next: () => {
          this.alertService.SuccessAlert('Creado correctamente');
          this.isLoading = false; // Desactiva el spinner
          this.router.navigate(['login']);

          form.reset();
        },
        error: () => {
          this.alertService.ErrorAlert('Error al crear');
          this.isLoading = false;
          this.isButtonDisabled = false; // Reactiva el botón en caso de error
        }
      });
    } else {
      this.alertService.ErrorAlert('PersonId es nulo, no se puede crear el usuario');
    }
  }

}
