import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-setting-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './setting-user.component.html',
  styleUrl: './setting-user.component.css'
})
export class SettingUserComponent implements OnInit{
  passwordForm: FormGroup;


  constructor(private fb: FormBuilder) {
    // Crear el formulario con validaciones
    this.passwordForm = this.fb.group({
      username: [''],
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Aquí puedes cargar el nombre de usuario desde localStorage o un servicio
    const username = localStorage.getItem('username');

    // Rellenar el campo de nombre de usuario
    this.passwordForm.patchValue({
      username: username || '',
    });
  }

  // Validación personalizada para confirmar que las contraseñas coinciden
  passwordMatchValidator(formGroup: FormGroup) {
    const { newPassword, confirmPassword } = formGroup.controls;
    if (newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else {
      confirmPassword.setErrors(null);
    }
  }

  // Enviar el formulario
  onSubmit() {
    if (this.passwordForm.valid) {
      console.log('Formulario enviado:', this.passwordForm.value);
      // Aquí iría la lógica para enviar la nueva contraseña al servidor, por ejemplo:
      // this.authService.updatePassword(this.passwordForm.value).subscribe(...);
    }
  }
}
