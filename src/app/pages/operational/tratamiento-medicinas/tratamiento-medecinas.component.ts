import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { TreatmentsMedicines } from './tratamiento-medecinas.module';
import { TreatmentsMedicinesService } from './tratamiento-medecinas.service';
import { AlertService } from '../../../shared/components/alert.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tratamiento-medecinas',
  standalone: true,
  imports: [CommonModule, FormsModule,
    MatIconModule,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './tratamiento-medecinas.component.html'
})
export class TratamientoMedecinasComponent implements OnInit {
  treatmentsMedicines: TreatmentsMedicines[] = [];
  newTreatmentMedicine: TreatmentsMedicines = { description: '', periocityDay: 0, medicinesId: 0, medicines: '', treatmentId: 0, treatment: '' };
  displayedColumns: string[] = ['description', 'periocityDay', 'medicines', 'treatment', 'actions'];
  dataSource!: MatTableDataSource<TreatmentsMedicines>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private treatmentMedicineService: TreatmentsMedicinesService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.getTreatmentsMedicines();
  }

  getTreatmentsMedicines(): void {
    this.treatmentMedicineService.getAllTreatmentsMedicinesService().subscribe({
      next: (res: TreatmentsMedicines[]) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
      }
    });
  }

  onEdit(treatmentMedicine: TreatmentsMedicines): void {
    this.newTreatmentMedicine = { ...treatmentMedicine };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then(res => {
      if (res.isConfirmed) {
        this.treatmentMedicineService.deleteTreatmentsMedicinesService(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            this.getTreatmentsMedicines();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar');
          }
        });
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newTreatmentMedicine.treatmentId > 0) {
        this.treatmentMedicineService.updateTreatmentsMedicinesService(this.newTreatmentMedicine.treatmentId, this.newTreatmentMedicine).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            this.getTreatmentsMedicines();
            form.resetForm();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.treatmentMedicineService.createTreatmentsMedicinesService(this.newTreatmentMedicine).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            this.getTreatmentsMedicines();
            form.resetForm();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al crear');
          }
        });
      }
    }
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

