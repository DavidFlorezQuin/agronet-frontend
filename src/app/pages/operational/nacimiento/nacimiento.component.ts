
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { NacimetoService } from './nacimiento.service';
import { AlertService } from '../../../shared/components/alert.service';
import { Nacimiento } from './nacimiento.module';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Config } from 'datatables.net';
import { FormsModule } from '@angular/forms';
import { error } from 'jquery';
import { DataTablesModule } from 'angular-datatables';
import { MatButtonModule } from '@angular/material/button';
import { InseminationService } from '../inseminacion/inseminacion.service';
import { Insemination } from '../inseminacion/Insemination.module';
import { Animal } from '../animal/animal.module';
import Swal from 'sweetalert2';
import { ElementRef } from '@angular/core';
declare var bootstrap: any;
import { Modal } from 'bootstrap';
@Component({
  selector: 'app-nacimiento',
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
  templateUrl: './nacimiento.component.html',
  styleUrl: './nacimiento.component.css'
})
export class NacimientoComponent implements OnInit {
  IdFarm: number | null = null;
  bulls: Animal[] = [];
  inseminations: any[] = [];
  nacimiento: Nacimiento[] = [];
  newNacimiento: Nacimiento = {
    id: 0,
    assistence: 0, 
    result: 0,
    description: '',
    birthWeight: 0,
    inseminationId: 0, 
    AnimalId: null,


  };
  displayedColumns: string[] = ['id', 'Assistence', 'Result', 'Description', 'BirthWeight', 'Inseminacionid', 'AnimalId'];

  dataSource: MatTableDataSource<Nacimiento> = new MatTableDataSource<Nacimiento>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('Modal') Modal!: ElementRef;
  constructor(private nacimientoService: NacimetoService, private alertaService: AlertService, private inseminationService: InseminationService) { }

  ngOnInit(): void {
    const idFarmString = localStorage.getItem('idFincaSeleccionada');

    if (idFarmString && !isNaN(Number(idFarmString))) {
      this.IdFarm = Number(idFarmString); // Convertir a number
    } else {
      console.error('ID de la finca no válido o no presente en localStorage');
      this.IdFarm = null; // Si no hay ID, establecer a null
    }

    if (this.IdFarm !== null) {
      this.ListNacimiento(this.IdFarm);
      this.listInseminations(this.IdFarm);
    } else {
      console.warn('No se pudo obtener el ID de la finca.');
    }
  }

  validateBirthWeight(): boolean {
    return typeof this.newNacimiento.birthWeight === 'number' && this.newNacimiento.birthWeight >= 0;
  }

  listInseminations(IdFarm: number): void {
    this.inseminationService.getInseminations(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;

        this.inseminations = data;
      },
      error: () => {
        this.alertaService.ErrorAlert('Error al obtener los datos');
      }
    });
  }


  ListNacimiento(IdFarm: number): void {
    this.nacimientoService.getNacimiento(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.data = data;
        this.nacimiento = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
    error: () => {
      this.alertaService.ErrorAlert('Error al obtener los datos de nacimiento')
    }
  }

  downloadPDF() {

  }

  aplicarFiltro(event: Event): void {

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  onEdit(nacimiento: Nacimiento): void {
    this.newNacimiento = { ...nacimiento };
  }


  eliminar(id: number): void {
    this.alertaService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.nacimientoService.deleteNacimiento(id).subscribe({
          next: (res) => {
            this.alertaService.SuccessAlert('Eliminado con éxito');
            if (this.IdFarm !== null) {
              this.ListNacimiento(this.IdFarm);
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al eliminar el animal');
          }
        });
      }
    });
  }

  editar(form: NgForm): void {
    if (form.valid) {
      if (this.newNacimiento.id > 0) {
        this.nacimientoService.updateNacimiento(this.newNacimiento, this.newNacimiento.id).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Actualizado con éxito');
            form.reset();
            this.ListNacimiento;
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al actualizar el animal');
          }
        });
      }
    } else {
      this.alertaService.ErrorAlert('Por favor, complete los datos requeridos');
    }

  }
   // Función para cerrar el modal
   closeModal(): void {
    const modalElement = document.getElementById('modalNacimiento');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
      modal.hide(); // Cierra el modal
      modalElement.classList.remove('show');
      modalElement.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      document.body.style.overflow = ''; // Restaurar el overflow del body
  
      // Eliminar cualquier 'modal-backdrop' que haya quedado
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove(); // Elimina la capa de fondo negra
      }
    } else {
      console.error('El modal no se encontró. Asegúrate de que el ID sea correcto.');
    }


  }
  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newNacimiento.id > 0) {
        this.nacimientoService.updateNacimiento(this.newNacimiento, this.newNacimiento.id).subscribe({
          next: () => {
            this.alertaService.SuccessAlert('Actualizado correctamente');
            form.reset();
            this.newNacimiento = {
              id: 0,
              assistence: 0, 
              result: 0,
              description: '',
              birthWeight: 0,
              inseminationId: 0, 
              AnimalId: null,  // Se establece como null aquí
            }
            if (this.IdFarm !== null) {
              this.ListNacimiento(this.IdFarm);
              
            } else {
              console.warn('No se pudo obtener el ID de la finca.');
            }
            this.closeModal();
          },
          error: () => {
            this.alertaService.ErrorAlert('Error al actualizar');
          }
        });
      } else {


        const formData = form.value;
        const Data: Nacimiento = {
          ...formData,
          assistence: this.newNacimiento.assistence === 1 ? true : false ,
          state:true
        }
        this.nacimientoService.createNacimiento(Data).subscribe({
          next: () => {

            Swal.fire({
              title: `Nacimiento registrado con éxito!`,
              icon: 'success',
              confirmButtonText: 'OK',
              buttonsStyling: false,
              html: `
                <a href="animales" class="btn btn-success px-4" style="text-decoration: none;">
                  Agregar animal
                </a>
              `,
              customClass: {
                confirmButton: 'btn btn-primary px-4',
              },
            });
            form.reset();
            if (this.IdFarm !== null) {
              this.ListNacimiento(this.IdFarm);
              
            }        
            this.closeModal();
          },
          error: (err) => {
            console.error(err); 
            this.alertaService.ErrorAlert('Error al crear');
          }
        });
      }
    } else {
      this.alertaService.ErrorAlert('Por favor completa todos los campos');
    }
  }
  
  checkValidSelection(selectControl: any): void {
    if (selectControl.invalid && selectControl.touched) {
      console.error('Selección no válida');

      if (selectControl.value === '') {
        selectControl.control.setErrors({ required: true });
      } else {
        selectControl.control.setErrors(null);
      }
      selectControl.control.markAsTouched();
    }
  }
  preventNegative(event: KeyboardEvent): void {
    if (event.key === '-') {
      event.preventDefault(); // Prevenir la entrada del símbolo de menos
    }
  }
}
