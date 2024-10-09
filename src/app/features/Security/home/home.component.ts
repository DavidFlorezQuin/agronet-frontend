import { Component, OnInit } from '@angular/core';
import { FincaService } from '../../../pages/operational/finca/finca.service';
import { AlertService } from '../../../shared/components/alert.service';
import { CommonModule } from '@angular/common';
import { AnimalService } from '../../../pages/operational/animal/animal.service';
import { Animal } from '../../../pages/operational/animal/animal.module';
import { ProductionsService } from '../../../pages/operational/produccion/produccion.service';
import { Productions } from '../../../pages/operational/produccion/produccion.module';
import { VentasService } from '../../../pages/operational/ventas/ventas.service';
import { Ventas } from '../../../pages/operational/ventas/ventass.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule

  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponentD implements OnInit {

  constructor(private fincaService: FincaService, private alertService: AlertService, private animalService: AnimalService, private productionsService: ProductionsService, private salesService: VentasService) { }
 
  animales: Animal[] = [];
  productions: Productions[] = [];
  sales: Ventas[] = [];

  fincas: any[] = []; 
  idFincaSeleccionada: number | null = null; 

  ngOnInit(): void {
    const StorageId: string | null = localStorage.getItem('Usuario');
    const IdUser: number = StorageId ? Number(StorageId) : 0; 
    
    this.listFincas(IdUser);

  }

  guardarIdFinca(id: number): void {
    this.idFincaSeleccionada = id; // Guarda el ID de la finca seleccionada
    localStorage.setItem('idFincaSeleccionada', id.toString());
    this.ListAnimal(this.idFincaSeleccionada)
    this.listProductions(this.idFincaSeleccionada)
    this.listSales(this.idFincaSeleccionada )
  }

  listFincas(IdFarm: number): void {
    this.fincaService.getFincas(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.fincas = data; // Aquí guardas las fincas
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
      }
    });
  }

  listSales(IdFarm:number): void {
    this.salesService.getSales(IdFarm).subscribe({
      next: (res: any) => {

        const data = res.data;
        this.sales = data;
      },
      error: () => {
      }
    });
  }

  ListAnimal(IdFarm: number): void {
    this.animalService.getAnimals(IdFarm).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.animales = data;
      },
      error: () => {
      }
    });
  }

  listProductions(farmId:number): void {
    this.productionsService.getProductions(farmId).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.productions = data; 

      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
