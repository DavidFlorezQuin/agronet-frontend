import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { InseminationService } from './insemination.service';
import { AlertService } from '../../../shared/components/alert.service';
import { Insemination } from './insemination.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-insemination',
  templateUrl: './insemination.component.html',
  styles: []
})
export class InseminationComponent implements OnInit {

  inseminations: Insemination[] = [];
  newInsemination: Insemination = {
    id: 0, date: new Date(), observation: '', FatherId: 0, MotherId: 0, father: { id: 0, animal: '', gender: '', weight: 0, photo: '', race: '', purpose: '', birthDay: new Date(), dateRegister: new Date(), LotId: 0 }, mother: { id: 0, animal: '', gender: '', weight: 0, photo: '', race: '', purpose: '', birthDay: new Date(), dateRegister: new Date(), LotId: 0 }
  };

  dtoptions: DataTables.Settings = {};
  dttrigger: Subject<any> = new Subject<any>();

  constructor(private inseminationService: InseminationService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.dtoptions = {
      pagingType: 'full_numbers',
      lengthMenu: [5, 10, 15, 20]
    };
    this.listInseminations();
  }

  listInseminations(): void {
    this.inseminationService.getInseminations().subscribe({
      next: (res) => {
        this.inseminations = res;
        this.dttrigger.next(null);
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
      }
    });
  }

  onEdit(insemination: Insemination): void {
    this.newInsemination = { ...insemination };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.inseminationService.deleteInsemination(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado correctamente');
            this.listInseminations();
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
      if (this.newInsemination.id > 0) {
        this.inseminationService.updateInsemination(this.newInsemination, this.newInsemination.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.listInseminations();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.inseminationService.createInsemination(this.newInsemination).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listInseminations();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al crear');
          }
        });
      }
    } else {
      this.alertService.ErrorAlert('Por favor complete todos los campos');
    }
  }
}
