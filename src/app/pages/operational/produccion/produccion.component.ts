import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProductionsService } from './productions.service';
import { AlertService } from '../../../shared/components/alert.service';

@Component({
  selector: 'app-produccion',
  standalone: true,
  imports: [],
  templateUrl: './produccion.component.html',
  styleUrl: './produccion.component.css'
})
export class ProduccionComponent implements OnInit {
  newProduction: Productions = {
    id: 0,
    typeProduction: '',
    stock: 0,
    measurement: '',
    description: '',
    quantityTotal: 0,
    expirateDate: undefined,
    animalId: 0,
    animal: { id: 0, name: '' }
  };

  productions: Productions[] = [];

  constructor(private productionsService: ProductionsService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.listProductions();
  }

  listProductions(): void {
    this.productionsService.getProductions().subscribe({
      next: (data) => {
        this.productions = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener producciones');
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newProduction.id > 0) {
        this.productionsService.updateProduction(this.newProduction).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Producción actualizada correctamente');
            form.reset();
            this.listProductions();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar producción');
          }
        });
      } else {
        this.productionsService.createProduction(this.newProduction).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Producción creada correctamente');
            form.reset();
            this.listProductions();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al crear producción');
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

}
