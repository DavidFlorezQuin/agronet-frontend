import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule, NgForm } from '@angular/forms';
import { InseminationService } from './inseminacion.service'; 
import { AlertService } from '../../../shared/components/alert.service';
import { Insemination } from './inseminacion.module'; 
import { Subject } from 'rxjs';
import { Config } from 'datatables.net';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-insemination',
  standalone: true,
  imports: [CommonModule, FormsModule,

    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './inseminacion.component.html',
  styles: []
})
export class InseminationComponent implements OnInit {
  dataSource: MatTableDataSource<Insemination> = new MatTableDataSource<Insemination>();
  displayedColumns:string[] = ['id', 'description','FatherId','father','MotherId','mother','result' ,'inseminationType' ];
  inseminations: Insemination[] = [];
  newInsemination: Insemination = {
    id: 0, description: '',
    FatherId: 0,
    MotherId: 0,
    father: { id: 0, name: '', gender: '', weight: 0, photo: '', raceId: 0, purpose: '', birthDay: new Date(), dateRegister: new Date(), LotId: 0, state: true },
    mother: { id: 0, name: '', gender: '', weight: 0, photo: '', raceId: 0, purpose: '', birthDay: new Date(), dateRegister: new Date(), LotId: 0, state: true },
    result: '',
    inseminationType: ''
  };

  dtoptions: Config = {};
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

  aplicarFiltro(event:Event): void{

    const filterValue=(event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    }
}
