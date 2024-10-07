import { Component, OnInit } from '@angular/core';
import { NewSend } from './NewSend.module';
import { NewSendService } from './new-password.service';
import { AlertService } from '../../../shared/components/alert.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent implements OnInit {
  send: NewSend[] = [];
  newSend: NewSend = { newPassword: '', token: '' }

  constructor(private router: Router, private route: ActivatedRoute, private newSendService: NewSendService, private alertService: AlertService){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.newSend.token = params['token'] || ''; // Si no hay token en la URL, asigna una cadena vacía
    });
  }
  onSubmit(form: NgForm): void {
    if (form.valid) {

      this.newSendService.resetPassword(this.newSend).subscribe({
        next: () => {
          this.alertService.SuccessAlert('Contraseña actualizada ');
          form.reset();
          this.router.navigate(['/login']); // Cambia a la ruta de login

        },
        error: () => {
          this.alertService.ErrorAlert('Error al crear');
        }
      })
      
    }
    else {
    this.alertService.ErrorAlert('Por favor complete todos los campos');
    }
  }
}
