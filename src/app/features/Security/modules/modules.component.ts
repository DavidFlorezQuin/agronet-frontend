import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModuleService } from './module.service';
import { Modulo } from './modulo.module';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { AlertService } from '../../../shared/components/alert.service';

@Component({
  selector: 'app-modules',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTablesModule],
  templateUrl: './modules.component.html',
  styles: ``
})
export class ModulesComponent implements OnInit, OnDestroy {
  
  modulos: Modulo[] = [];
  newModulo: Modulo = { id: 0, name: '', description: '' };
  
  constructor(private serviceModule: ModuleService, private alertService: AlertService) { }
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  
  
  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 15, 20],
    };
    
    this.listModules();
  }
  
  listModules(): void {
    this.serviceModule.getModules().subscribe({
      next: (modulos: Modulo[]) => {
        
        this.modulos = modulos;
        
        this.rerender(); 
      },
      error: () => {
        this.alertService.ErrorAlert('Algo salió mal!');
      }
    });
  }

  rerender(): void {

    if ($.fn.DataTable.isDataTable('.table')) {
      // Destruye la tabla existente
      $('.table').DataTable().clear().destroy();

    }

    // Re-trigger de DataTables para inicializar la tabla de nuevo
    this.dtTrigger.next(null);
    
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newModulo.id) {
        this.serviceModule.updateModules(this.newModulo, this.newModulo.id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Actualizado ');
            form.reset();
            this.newModulo = { id: 0, name: '', description: '' };
            this.listModules(); 
          },
          error: () => {
            this.alertService.ErrorAlert('Algo salió mal!');
          }
        });
      } else {
        this.serviceModule.createModules(this.newModulo).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Guardado');
            form.reset();
            this.listModules(); // Recargar lista de módulos después de crear
          },
          error: () => {
            this.alertService.ErrorAlert('Algo salió mal!');
          }
        });
      }
    }
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.serviceModule.deleteModules(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Eliminado con éxito!');
            this.listModules(); // Recargar lista de módulos después de eliminar
          },
          error: () => {
            this.alertService.ErrorAlert('Algo salió mal!');
          }
        });
      }
    });
  }

  onEdit(modulo: Modulo): void {
    this.newModulo = { ...modulo };
  }
}
