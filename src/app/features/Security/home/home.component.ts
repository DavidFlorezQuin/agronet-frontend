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
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { AlertaService } from '../../../pages/operational/alerta/alerta.service';
import { Alert } from 'bootstrap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponentD implements OnInit {

  public chart!: Chart;
  userName: string = '';

  animales: Animal[] = [];
  productions: Productions[] = [];
  sales: Ventas[] = [];
  fincas: any[] = [];
  idFincaSeleccionada: number | null = null;

  constructor(
    private fincaService: FincaService,
    private alertService: AlertService,
    private alertsService: AlertaService,
    private animalService: AnimalService,
    private productionsService: ProductionsService,
    private salesService: VentasService
  ) {}

  ngOnInit(): void {
    const storageId: string | null = localStorage.getItem('Usuario');
    const idUser: number = storageId ? Number(storageId) : 0;
    
  
    this.listFincas(idUser);
    this.crearGraficaInicial(); // Crear la gráfica sin datos al cargar la vista

  }
  crearGraficaInicial(): void {
    this.chart = new Chart('char', {
      type: 'bar',
      data: {
        labels: ['Sin datos'], // Etiquetas iniciales
        datasets: [{
          label: 'Producción de Leche (litros)',
          data: [0], // Valores iniciales
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Gráfica de Producción (Sin Datos)'
          }
        }
      }
    });
  }  // Método para guardar el ID de la finca seleccionada y actualizar datos
  guardarIdFinca(id: number): void {
    this.idFincaSeleccionada = id;
    localStorage.setItem('idFincaSeleccionada', id.toString());
    this.actualizarDatosFinca(id); // Actualizar datos al cambiar finca
  }

  // Método que actualiza todos los datos al seleccionar una finca
  actualizarDatosFinca(farmId: number): void {
    this.listProductions(farmId);
    this.ListAnimal(farmId);
    this.listSales(farmId);
    this.actualizarGrafica(farmId); // Llamar al método para actualizar la gráfica
  }

  // Método para actualizar la gráfica con nuevos datos
  actualizarGrafica(farmId: number): void {
    this.productionsService.getMonthlyMilkProduction(farmId).subscribe(data => {
      const defaultLabels = ['June', 'July', 'August', 'September', 'October'];
      const defaultValues = [0, 0, 0, 0, 0];

      const labels = data.length > 0 ? data.map(d => d.mes) : defaultLabels;
      const values = data.length > 0 ? data.map(d => d.litros) : defaultValues;

      if (this.chart) {
        this.chart.destroy(); // Destruir la gráfica anterior antes de crear una nueva
      }

      this.chart = new Chart('char', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Producción de Leche (litros)',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            title: {
              display: true,
              text: data.length > 0 
                ? 'Producción Mensual de Leche' 
                : 'Sin datos, mostrando valores en cero'
            }
          }
        }
      });
    });
  }

  listFincas(idUser: number): void {
    this.fincaService.getFincas(idUser).subscribe({
      next: (res: any) => {
        this.fincas = res.data;
      },
      error: () => {
        this.alertService.ErrorAlert('Error al obtener los datos');
      }
    });
  }

  listSales(farmId: number): void {
    this.salesService.getSales(farmId).subscribe({
      next: (res: any) => {
        this.sales = res.data;
      },
      error: () => {
        console.error('Error al obtener las ventas');
      }
    });
  }

  ListAnimal(farmId: number): void {
    this.animalService.getAnimals(farmId).subscribe({
      next: (res: any) => {
        this.animales = res.data;
      },
      error: () => {
        console.error('Error al obtener los animales');
      }
    });
  }

  listProductions(farmId: number): void {
    this.productionsService.getProductions(farmId).subscribe({
      next: (res: any) => {
        this.productions = res.data;
      },
      error: (error) => {
        console.error('Error al obtener las producciones:', error);
      }
    });
  }
}
