import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PersonService } from '../../../features/Security/person/person.service';
import { Person } from '../../../features/Security/person/person.module';

@Component({
  selector: 'app-settings-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings-profile.component.html',
  styleUrl: './settings-profile.component.css'
})
export class SettingsProfileComponent implements OnInit {
  
  userForm: FormGroup;

  constructor(private fb: FormBuilder, private personService: PersonService) {
    this.userForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      gender: [''],
      document: [''],
      typeDocument: [''],
      direction: [''],
      phone: [''],
      birthday: [''],
      state: [''],
    });
    const storagePerson: string | null = localStorage.getItem('person');
    const idPerson: number = storagePerson ? Number(storagePerson) : 0;

    this.personService.getPersonById(idPerson).subscribe({
      next: (res:Person) =>{
        this.userForm.patchValue({
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
          gender: res.gender,
          document: res.document,
          typeDocument: res.typeDocument,
          direction: res.direction,
          phone: res.phone,
          birthday: res.birthday,
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
    // Aquí puedes manejar el envío del formulario
    console.log(this.userForm.value);
  }

}