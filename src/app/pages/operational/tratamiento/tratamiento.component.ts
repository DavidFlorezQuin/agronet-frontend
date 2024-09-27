import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TreatmentsService } from './treatments.service';
import { AlertService } from '../../../shared/components/alert.service';

@Component({
  selector: 'app-tratamiento',
  standalone: true,
  imports: [],
  templateUrl: './tratamiento.component.html',
  styleUrl: './tratamiento.component.css'
})
export class TratamientoComponent implements OnInit {
  newTreatment: Treatments = {
    id: 0,
    description: '',
    finishiedDate: new Date(),
    startDate: new Date(),
    animalDiagnosticsId: 0,
    animalDiagnostics: { id: 0, name: '' }
  };

  treatments: Treatments[] = [];

  constructor(private treatmentsService: TreatmentsService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.listTreatments();
  }

  listTreatments(): void {
    this.treatmentsService.getTreatments().subscribe({
      next: (data) => {
        this.treatments = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener tratamientos');
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newTreatment.id > 0) {
        this.treatmentsService.updateTreatment(this.newTreatment).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Tratamiento actualizado correctamente');
            form.reset();
            this.listTreatments();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar tratamiento');
          }
        });
      } else {
        this.treatmentsService.createTreatment(this.newTreatment).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Tratamiento creado correctamente');
            form.reset();
            this.listTreatments();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al crear tratamiento');
          }
        });
      }
    } else {
      this.alertService.ErrorAlert('Por favor complete todos los campos');
    }
  }

  onEdit(treatment: Treatments): void {
    this.newTreatment = { ...treatment };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.treatmentsService.deleteTreatment(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Tratamiento eliminado correctamente');
            this.listTreatments();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar tratamiento');
          }
        });
      }
    });
  }

}
