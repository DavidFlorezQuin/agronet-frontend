import { CategoryMedicinasService } from './categoria-medicina..service';
import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
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
import { ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { CategoryMedicinas } from './categoria-medicina.module';

@Component({
  selector: 'app-categoria-medicina',
  standalone: true,
  imports: [CommonModule,FormsModule,
    MatIconModule,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './categoria-medicina.component.html',
  styleUrls: ['./categoria-medicina.component.css']
})
export class CategoriaMedicinaComponent implements OnInit{
   newCategoryMedicina: CategoryMedicinas={id:0, Name:'',Description:''}
   displayedColumns: string[] = [ 'id','Name','Description','Acciones']
  categoriaMedicina: CategoryMedicinas[]= [];
  dataSource!: MatTableDataSource<CategoryMedicinas>;
  dtoptions: Config={};
  dttrigger: Subject<any>= new Subject<any>();

  // referenicas del paginador y sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

constructor(private alertService:AlertService, private CategoryMedicinasService:CategoryMedicinasService){}
  ngOnInit(): void {

    this.dtoptions={
      pagingType:'ful_numbers',
      lengthMenu:[5,10,15,20]
    };
    this.listCategoriaMedicina();
  }
  listCategoriaMedicina(): void {
    this.CategoryMedicinasService.getCategoryMedicinas().subscribe({
      next: (res: CategoryMedicinas[])=>{
        this.dataSource= new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.categoriaMedicina = res;
        this.dttrigger.next(null);
        this.dataSource.data = res;
      },
      error: ()=>{
        this.alertService. ErrorAlert('Error al obtener los datos');
      }
    });
  }

  onEdit(CategoryMedicinas:CategoryMedicinas): void {
    this.newCategoryMedicina = {...CategoryMedicinas};


  }

  onDelete(id:number): void {
    this.alertService.DeleteAlert().then((res)=>{
      if(res.isConfirmed){
        this.CategoryMedicinasService.onDeleteCategoryMedicinas(id).subscribe({
          next: ()=>{
            this.alertService.SuccessAlert('Eliminado correctamente');
            this.listCategoriaMedicina();
          },
          error: ()=>{
            this.alertService.ErrorAlert('Error al eliminar');
          }
        });
      }
    });
  }
  onSubmit(form:NgForm): void{
    if(form.valid){
      if(this.newCategoryMedicina.id>0){
        this.CategoryMedicinasService.updateCategoryMedicinas(this.newCategoryMedicina,this.newCategoryMedicina.id).subscribe({
          next: ()=>{
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.newCategoryMedicina={id:0, Name:'',Description:'' };
              this.listCategoriaMedicina();

          },
          error: ()=>{
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      }else{
        this.CategoryMedicinasService.createCategoryMedicinas(this.newCategoryMedicina).subscribe({
          next: ()=>{
            this.alertService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listCategoriaMedicina();
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
