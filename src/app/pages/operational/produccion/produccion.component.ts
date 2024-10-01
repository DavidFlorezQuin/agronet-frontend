import { Component, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductionsService } from './produccion.service';
import { AlertService } from '../../../shared/components/alert.service';
import { Productions } from './produccion.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import { Animal } from '../animal/animal.module';
import { AnimalService } from '../animal/animal.service';

@Component({
  selector: 'app-produccion',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    DataTablesModule,
    CommonModule,
    FormsModule,
   MatIconModule,
   MatButtonModule,
   MatFormFieldModule,
   MatInputModule,
   MatTableModule,
   MatPaginatorModule,
   MatSortModule],
  templateUrl: './produccion.component.html'
})
export class ProduccionComponent implements OnInit {
  newProduction: Productions = {
    id: 0,
    typeProduction: '',
    stock: 0,
    measurement: '',
    description: '',
    quantityTotal: 0,
    expirateDate: new Date(),
    animalId: 0,

  };
animales: Animal[] = [];
  productions: Productions[] = [];
  displayedColumns: string[] = ['id',
    'typeProduction',
    'stock',
    'measurement',
    'description ',
    'quantityTotal',
    'expirateDate',
    'animalId']
  dataSource!: MatTableDataSource<Productions>;
  dtoptions: Config = {};
  dttrigger: Subject<any> = new Subject<any>();

  // referenicas del paginador y sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private productionsService: ProductionsService,private animalService:AnimalService ,private alertService: AlertService) { }

  ngOnInit(): void {
   
    this.listProductions();
    this.listAnimales();
  }

  listProductions(): void {
    this.productionsService.getProductions().subscribe({
      next: (res: Productions[]) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      
      },
      error: (error)=>{
        console.log(error);
        this.alertService.ErrorAlert('Error al cargar los medicamentos');
      }
    });
  }

  listAnimales(): void {
    this.animalService.getAnimals().subscribe({
      next: (Animales: Animal[]) => {
        this.animales=Animales;
      },
      error: (error)=>{
        console.log(error);
        this.alertService.ErrorAlert('Error al cargar los medicamentos');
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newProduction.id > 0) {
        this.productionsService.updateProduction(this.newProduction, this.newProduction.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.newProduction = { id: 0, typeProduction: '', stock: 0, measurement: '', description: '', quantityTotal: 0, expirateDate: new Date(), animalId: 0 };
            this.listProductions();

          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar');
          }
        });
      } else {
        this.productionsService.createProduction(this.newProduction).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Creado correctamente');
            form.reset();
            this.listProductions();
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

  onEdit(production: Productions): void {
    this.newProduction = { ...production };


  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.productionsService.deleteProduction(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Producción eliminada correctamente');
            this.listProductions();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar producción');
          }
        });
      }
    });
  }
  aplicarFiltro(event: Event): void {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valorFiltro.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
