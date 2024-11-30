import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Auth } from './models/Auth.module';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AlertService } from '../../shared/components/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  auth: any[] = [];

  newAuth: Auth = { username: '', password: '' }

  constructor(private serviceAuth: AuthService, private router: Router, private serviceAlert: AlertService) { }

  onSubmit(form: NgForm) {
    this.serviceAuth.login(this.newAuth).subscribe({
      next: (res) => {
        const data = res.data; 
        const id = data.id;
        const username = data.username;
        const person = data.personId;
        localStorage.setItem('Usuario', id.toString());
        localStorage.setItem('username', username.toString());
        localStorage.setItem('person', person.toString());

        console.log(res);
        this.serviceAuth.setRoleMenu(id)
        this.serviceAuth.setLoggedIn(true)  
        this.router.navigate(['/dashboard/'])

      },
      error: (err) => {
        this.serviceAlert.ErrorAlert('Credeciales incorrectas!')

      }
    })
  }

}
