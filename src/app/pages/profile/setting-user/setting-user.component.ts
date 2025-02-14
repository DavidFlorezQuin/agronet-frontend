import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../features/Security/users/user.service';
import { AlertService } from '../../../shared/components/alert.service';
import { User } from '../../../features/Security/users/User.module';

@Component({
  selector: 'app-setting-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './setting-user.component.html',
  styleUrl: './setting-user.component.css'
})
export class SettingUserComponent implements OnInit{
  passwordForm: FormGroup;
  user: any = {};
  imageUrl: string | null = null;

  constructor(private fb: FormBuilder, private userService:UserService, private alertService:AlertService) {
    // Crear el formulario con validaciones
    this.passwordForm = this.fb.group({
      username: [''],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validator: this.passwordMatchValidator.bind(this) // Asegura el contexto correcto
    });
  }

  ngOnInit(): void {
    // Aquí puedes cargar el nombre de usuario desde localStorage o un servicio
    const username = localStorage.getItem('username');
    const storageId: string | null = localStorage.getItem('Usuario');
    const idUser: number = storageId ? Number(storageId) : 0;

    this.listUser(idUser);

    // Rellenar el campo de nombre de usuario
    this.passwordForm.patchValue({
      username: username || '',
    });
  }
  
  // Validación personalizada para confirmar que las contraseñas coinciden
  passwordMatchValidator(formGroup: FormGroup): void {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword');
  
    if (newPassword !== confirmPassword?.value) {
      confirmPassword?.setErrors({ mismatch: true });
    } else {
      confirmPassword?.setErrors(null); // Limpia los errores si coinciden
    }
  }
  

  passwordError: string = '';
  validatePassword(): void {
    const newPassword = this.passwordForm.get('newPassword')?.value;
    const regex = /^(?=.*[0-9])(?=.*[@!/&]).{3,15}$/;
  
    if (!regex.test(newPassword)) {
      this.passwordError = 'La contraseña debe contener al menos un número y uno de los siguientes símbolos: @ ! / &';
      this.passwordForm.get('newPassword')?.setErrors({ invalidFormat: true });
    } else {
      this.passwordError = '';
      this.passwordForm.get('newPassword')?.setErrors(null);
    }
  }

  
  listUser(id: number):void{
    this.userService.getUserById(id).subscribe({
      next: (res)=>{
        this.user = res;
        if (this.user.photo) {
          this.imageUrl = `data:image/jpeg;base64,${this.user.photo}`; // Convierte Base64 a URL
        }
      },
      error: () => {
        this.alertService.ErrorAlert('Error al buscar');
      }
    })
  }
  

  // Enviar el formulario
  onSubmit() {
      const idPerson = Number(localStorage.getItem('person')); 
      const idUser = Number(localStorage.getItem('Usuario')); 
      const updatedPerson = this.passwordForm.value;

      const data: User = {
        id:idUser,
        username: updatedPerson.username,
        password: updatedPerson.newPassword,
        personId: idPerson
      }
  
      this.userService.updateUser(data, idUser).subscribe({
        next: (res) => {
          this.alertService.SuccessAlert('Actualizado')
        },
        error: (err) => {
          this.alertService.ErrorAlert('Sucedió un problema')

        }
      });
    
    }
  }

