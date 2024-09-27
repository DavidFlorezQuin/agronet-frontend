import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { VaccineAnimalsService } from './vaccine-animals.service';
import { AlertService } from '../../../shared/components/alert.service';

@Component({
  selector: 'app-vacunacion',
  standalone: true,
  imports: [],
  templateUrl: './vacunacion.component.html',
  styleUrl: './vacunacion.component.css'
})
export class VacunacionComponent implements OnInit {
  newVaccineAnimal: VaccineAnimals = {
    id: 0,
    animalId: 0,
    animal: { id: 0, name: '' },
    vaccineId: 0,
    vaccines: { id: 0, name: '' },
    dateApplied: new Date(),
    nextDose: new Date(),
  };

  vaccineAnimals: VaccineAnimals[] = [];

  constructor(private vaccineAnimalsService: VaccineAnimalsService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.listVaccineAnimals();
  }

  listVaccineAnimals(): void {
    this.vaccineAnimalsService.getVaccineAnimals().subscribe({
      next: (data) => {
        this.vaccineAnimals = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los registros de vacunas');
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newVaccineAnimal.id > 0) {
        this.vaccineAnimalsService.updateVaccineAnimal(this.newVaccineAnimal).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Vacuna actualizada correctamente');
            form.reset();
            this.listVaccineAnimals();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar la vacuna');
          }
        });
      } else {
        this.vaccineAnimalsService.createVaccineAnimal(this.newVaccineAnimal).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Vacuna registrada correctamente');
            form.reset();
            this.listVaccineAnimals();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al registrar la vacuna');
          }
        });
      }
    } else {
      this.alertService.ErrorAlert('Por favor complete todos los campos');
    }
  }

  onEdit(vaccineAnimal: VaccineAnimals): void {
    this.newVaccineAnimal = { ...vaccineAnimal };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.vaccineAnimalsService.deleteVaccineAnimal(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Registro eliminado correctamente');
            this.listVaccineAnimals();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar el registro');
          }
        });
      }
    });
  }

}
