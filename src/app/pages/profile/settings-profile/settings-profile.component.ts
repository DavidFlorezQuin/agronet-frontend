import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PersonService } from '../../../features/Security/person/person.service';
import { Person } from '../../../features/Security/person/person.module';
import { AlertService } from '../../../shared/components/alert.service';

@Component({
  selector: 'app-settings-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings-profile.component.html',
  styleUrl: './settings-profile.component.css'
})
export class SettingsProfileComponent implements OnInit {

  userForm: FormGroup;

  constructor(private fb: FormBuilder, private personService: PersonService, private alertService: AlertService) {
    this.userForm = this.fb.group({
      id:[''],
      firstName: [''],
      lastName: [''],
      email: [''],
      gender: [''],
      document: [''],
      typeDocument: [{ value: '', disabled: true }], // Aquí se deshabilita
      direction: [''],
      phone: [''],
      birthday: [''],
      state: [''],
    });
    const storagePerson: string | null = localStorage.getItem('person');
    const idPerson: number = storagePerson ? Number(storagePerson) : 0;

    this.personService.getPersonById(idPerson).subscribe({
      next: (res: Person) => {
        const formattedDate = res.birthday
        ? new Date(res.birthday).toISOString().split('T')[0]
        : '';
        this.userForm.patchValue({
          id:res.id,
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
          gender: res.gender,
          document: res.document,
          typeDocument: res.typeDocument,
          direction: res.direction,
          phone: res.phone,
          birthday: formattedDate,
          state: res.state,
        });
      }
    })
  }

  ngOnInit(): void {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email'); // Suponiendo que también tienes un email

    this.userForm.patchValue({
      username: username || '',
      email: email || '',
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const idPerson = Number(localStorage.getItem('person')); // Obtén el ID de la persona desde el localStorage
      const updatedPerson = this.userForm.value;
  
      this.personService.updatePerson(updatedPerson, idPerson).subscribe({
        next: (res) => {
          this.alertService.SuccessAlert('Actualizado')
        },
        error: (err) => {
          this.alertService.ErrorAlert('Sucedió un problema')

        }
      });
    } else {
      this.alertService.ErrorAlert('Por favor, completa todos los campos requeridos.')
    }
  }

}