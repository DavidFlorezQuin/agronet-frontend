import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from '../features/pages/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertaService } from '../pages/operational/alerta/alerta.service';
import { Alerta } from '../pages/operational/alerta/alerta.module';
import { FarmUserService } from '../pages/operational/finca-usuario/finca-usuario.service';
import { AlertService } from '../shared/components/alert.service';
import Swal from 'sweetalert2';
import { FarmUser } from '../pages/operational/finca-usuario/finca-usuario.module';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, CommonModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  username: string | null = null;


  code: string = '';
  alerts: Alerta[] = [];
  idUser: number = 0;
  farmUser: FarmUser[] = []; 

  ngOnInit(): void {
        this.username = localStorage.getItem('username');
  }

  constructor(
    private alertsService: AlertaService,
    private alertService: AlertService,
    private farmUserService: FarmUserService
  ) {
    const storageFarm: string | null = localStorage.getItem('idFincaSeleccionada');
    const idFarm: number = storageFarm ? Number(storageFarm) : 0;

    const storageUser: string | null = localStorage.getItem('Usuario');
    this.idUser = storageUser ? Number(storageUser) : 0;


    this.listAlertsNotRead(this.idUser); 
    this.listUserFarmJoin(this.idUser); 
  }
  onSubmit() {
    this.farmUserService.postCodeFarm(this.code, this.idUser).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: "success",
          title: "Solicitud enviada con exito",
          text: "Tu solicitud para unirte a la finca ha sido enviada. Espera la aprobación del propietario. ",
        });
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Error desconocido';

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMessage,
        });
      }
    }

    );
  }

  listUserFarmJoin(idUser: number): void {
    this.farmUserService.listUserFarmJoin(idUser).subscribe({
      next: (res: any) => {
        const data = res.data; 

        this.farmUser = data; 
      }
    });
  }
  
  listAlertsNotRead(id:number){
    this.alertsService.getAlertsNotRead(id).subscribe({
      next:(res: any) => {
        const data = res.data; 
        this.alerts = data;
      }
    })
  }
  onDelete(id:number){
    this.farmUserService.deleteFarmUsers(id).subscribe({
      next:(res:any) => {
        this.alertService.SuccessAlert('Eliminado con éxito');
      }
    })
  }
  acceptUser(id:number){
    this.farmUserService.joinUser(id).subscribe({
      next:(res:any) => {
        this.alertService.SuccessAlert('Usuario aceptado');
      }
    })
  }
}
