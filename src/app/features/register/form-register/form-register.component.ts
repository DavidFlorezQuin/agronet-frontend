import { Component, OnInit } from '@angular/core';
import { Person } from '../../Security/person/person.module';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { EnumService } from '../../../shared/components/enum.service';
import { PersonService } from '../../Security/person/person.service';
import { AlertService } from '../../../shared/components/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule],
  templateUrl: './form-register.component.html',
  styleUrl: './form-register.component.css'
})
export class FormRegisterComponent implements OnInit {
  typeDocuments: [] = [];
  persons: Person[] = [];
  newPerson: Person = { id: 0, state: true, firstName: '', lastName: '', email: '', gender: '', document: '', typeDocument: '', direction: '', phone: '', birthday: '' }
  
  emailError: string = ''; 
  ngOnInit(): void {
    this.listTypeDocument()
  }

  constructor(private enumService: EnumService, private router:Router, private personService:PersonService, private alertService:AlertService) { }

  listTypeDocument(): void {
    this.enumService.getTypeDocument().subscribe({
      next: (res: any) => {
        this.typeDocuments = res;
      },
      error: (err) => {
      }
    })
  }
  validateEmail(): void {
    this.emailError = '';
    if (this.newPerson.email) {
      const isValid = this.validateEmailDomain(this.newPerson.email);
      if (!isValid) {
        this.emailError = 'Solo se permiten correos de Gmail y Hotmail.';
      }
    }
  }

  validateEmailDomain(email: string): boolean {
    const allowedDomains = ['gmail.com', 'hotmail.com'];
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
  }
  onSubmit(form: NgForm) {
    this.personService.createPerson(this.newPerson).subscribe({
      next: (res) => {
        const personId = res.id;  

        this.router.navigate(['register-user'], { queryParams: { personId: personId } });
      },
      error: () => {
        this.alertService.ErrorAlert('Error al crear');
      }
    });
  }
}