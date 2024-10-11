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
  personId: number | null = null; // Inicializado como null
  newUser: User = {
    id: 0,
    password: '', 
    username: '',
    personId: 0,
  }

  constructor(private router:Router, private route: ActivatedRoute, private userService: UserService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.personId = +params['personId']; // Asegúrate de convertirlo a número
    });
  }

  onSubmit(form: NgForm): void {
    if (this.personId !== null) { // Asegúrate de que PersonId no es null
      this.newUser.personId = this.personId;

      this.userService.createUser(this.newUser).subscribe({
        next: () => {
          this.alertService.SuccessAlert('Creado correctamente');
          this.router.navigate(['login']);

          form.reset();
        },
        error: () => {
          this.alertService.ErrorAlert('Error al crear');
        }
      });
    } else {
      this.alertService.ErrorAlert('PersonId es nulo, no se puede crear el usuario');
    }
  }
}