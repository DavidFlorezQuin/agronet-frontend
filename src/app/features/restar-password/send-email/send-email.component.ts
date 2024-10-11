import { Component, OnInit } from '@angular/core';
import { Email } from './Email.module';
import { SendEmailService } from './send-email.service';
import { AlertService } from '../../../shared/components/alert.service';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.css'
})
export class SendEmailComponent implements OnInit {

  constructor(private sendService: SendEmailService, private alertService: AlertService) { }
  email: Email[] = [];
  newEmail: Email = { email: '' }

  ngOnInit(): void {

  }
  onSubmit(form: NgForm): void {
    if (form.valid) {

      this.sendService.resetPassword(this.newEmail).subscribe({
        next: () => {
          this.alertService.SuccessAlert('Email enviado');
          form.reset();
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