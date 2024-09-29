import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { AlertService } from '../../../shared/components/alert.service';
import { NgForm } from '@angular/forms';
import { MedicinaService } from './medicina.service';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { Medicina } from './medicina.component.module';
import { CategoryMedicinas } from '../categoria-medicina/categoria-medicina.module';

@Component({
  selector: 'app-medicina',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTablesModule,CommonModule,FormsModule,
    MatIconModule,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './medicina.component.html',
  styleUrls: ['./medicina.component.css']
})
export class MedicinaComponent implements OnInit{
medicina: Medicina[]=[];
CategoryMedicinas: CategoryMedicinas[]=[];
NewMedicinas: Medicina={id:0,Name:'',Administration:'',CategoryMedicinesId:0}
  displayedColumns: string[]=['id','Name','Administration','CategoryMedicinasId','actions'];
  dataSource!: MatTableDataSource<Medicina>;
  dtoptions: Config={};
  dttrigger: Subject<any>= new Subject<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private alertService:AlertService, private medicinaService:MedicinaService){}
ngOnInit(): void {
    this.dtoptions={
      pagingType:'ful_numbers',
      lengthMenu:[5,10,15,20]
    };
    this.listMedicinas();

  }

  listMedicinas():void{

    this.medicinaService.getMedicina().subscribe({
      next: (medicinas: Medicina[])=>{
        this.dataSource = new MatTableDataSource(medicinas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dttrigger.next(null);
      },
      error: (error)=>{
        console.log(error);
        this.alertService.ErrorAlert('Error al cargar los medicamentos');
      }
    });
  }
  onEdit(Medicina:Medicina): void {
    this.NewMedicinas = {...Medicina};


  }
  onDelete(id:number): void {
    this.alertService.DeleteAlert().then((res)=>{
      if(res.isConfirmed){
        this.medicinaService.deleteMedicina(id).subscribe({
          next: ()=>{
            this.alertService.SuccessAlert('Eliminado correctamente');
            this.listMedicinas();
          },
          error: ()=>{
            this.alertService.ErrorAlert('Error al eliminar');
          }
        });
      }
    });
  }
  /**
   * onView(role: { id: number, name: string }): void {
    this.medicinaService.changePerson(role);
    //this.rolesService.router.navigate(['dashboard/role-view']);
  }
   * @param role
   */

  onSubmit(form:NgForm): void{
    if(form.valid){
      if(this.NewMedicinas.id>0){
        this.medicinaService.updateMedicina(this.NewMedicinas,this.NewMedicinas.id).subscribe({
          next: ()=>{
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.NewMedicinas={id:0,Name:'',Administration:'',CategoryMedicinesId:0 };
              this.listMedicinas();

          },
          error: ()=>{
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      }else{
        this.medicinaService.createMedicina(this.NewMedicinas).subscribe({
          next: ()=>{
            this.alertService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listMedicinas();
          },
          error: ()=>{
            this.alertService.ErrorAlert('Error al crear');
          }
        });
      }
    }else{
      this.alertService.ErrorAlert('Por favor complete todos los campos');
    }

  }

  aplicarFiltro(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter =filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
  }

}
