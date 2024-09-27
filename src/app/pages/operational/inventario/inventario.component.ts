import { Component } from '@angular/core';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {
  newInventory: Inventories = {
    id: 0,
    name: '',
    description: '',
    farmId: 0,
    farm: { id: 0, name: '' }
  };

  inventories: Inventories[] = [];

  constructor(private inventoriesService: InventoriesService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.listInventories();
  }

  listInventories(): void {
    this.inventoriesService.getInventories().subscribe({
      next: (data) => {
        this.inventories = data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener inventarios');
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newInventory.id > 0) {
        this.inventoriesService.updateInventory(this.newInventory).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Inventario actualizado correctamente');
            form.reset();
            this.listInventories();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al actualizar inventario');
          }
        });
      } else {
        this.inventoriesService.createInventory(this.newInventory).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Inventario creado correctamente');
            form.reset();
            this.listInventories();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al crear inventario');
          }
        });
      }
    } else {
      this.alertService.ErrorAlert('Por favor complete todos los campos');
    }
  }

  onEdit(inventory: Inventories): void {
    this.newInventory = { ...inventory };
  }

  onDelete(id: number): void {
    this.alertService.DeleteAlert().then((res) => {
      if (res.isConfirmed) {
        this.inventoriesService.deleteInventory(id).subscribe({
          next: () => {
            this.alertService.SuccessAlert('Inventario eliminado correctamente');
            this.listInventories();
          },
          error: () => {
            this.alertService.ErrorAlert('Error al eliminar inventario');
          }
        });
      }
    });
  }

}
