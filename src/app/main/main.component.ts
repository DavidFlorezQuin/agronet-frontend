import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenuComponent } from '../features/pages/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertaService } from '../pages/operational/alerta/alerta.service';
import { Alerta } from '../pages/operational/alerta/alerta.module';
import { FarmUserService } from '../pages/operational/finca-usuario/finca-usuario.service';
import { AlertService } from '../shared/components/alert.service';
import Swal from 'sweetalert2';
import { FarmUser } from '../pages/operational/finca-usuario/finca-usuario.module';
import { UserService } from '../features/Security/users/user.service';
import { Alert } from 'bootstrap';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, CommonModule, FormsModule, RouterLink],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  username: string | null = null;
  user: any = {};
  imageUrl: string | null = null;

  code: string = '';
  alerts: Alerta[] = [];
  idUser: number = 0;
  idFarm: number = 0;
  farmUser: FarmUser[] = [];

  newAlerta: Alerta = {
    id: 0,
    name: '',
    description: '',
    date: new Date(),
    isRead: false,
    farmsId: 0,
    animalId: 0,
    categoryAlertId: 0,
    usersId: 0,
    state:0
  };

  ngOnInit(): void {

    this.username = localStorage.getItem('username');
    const storageId: string | null = localStorage.getItem('Usuario');
    const idUser: number = storageId ? Number(storageId) : 0;

    const storageIdFarm: string | null = localStorage.getItem('Usuario');
    const idFarm: number = storageId ? Number(storageId) : 0;

    this.listUser(idUser);
  }

  constructor(
    private alertsService: AlertaService,
    private alertService: AlertService,
    private farmUserService: FarmUserService,
    private userService: UserService
  ) {
    const storageFarm: string | null = localStorage.getItem('idFincaSeleccionada');
    this.idFarm = storageFarm ? Number(storageFarm) : 0;


    const storageUser: string | null = localStorage.getItem('Usuario');
    this.idUser = storageUser ? Number(storageUser) : 0;


    this.listAlertsNotRead(this.idFarm);
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

  updateAlert(alert: Alerta):void {
    this.newAlerta = { ...alert};
    this.newAlerta.state = 0
    if (this.newAlerta.date) {
      const dateObj = new Date(this.newAlerta.date);
      this.newAlerta.date = dateObj.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    }
    this.alertsService.updateAlerta(this.newAlerta, this.newAlerta.id).subscribe({
      next: () => {
        this.alertService.SuccessAlert('Actualizado correctamente');
      },
      error: (err) => {
        console.error(err);
        this.alertService.ErrorAlert('Error al actualizar: ' + err.message);
      }
    })
  }

  listUserFarmJoin(idUser: number): void {
    this.farmUserService.listUserFarmJoin(idUser).subscribe({
      next: (res: any) => {
        const data = res.data;

        this.farmUser = data;
      }
    });
  }

  listUser(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (res) => {
        this.user = res;
        if (this.user.photo) {
          this.imageUrl = `data:image/jpeg;base64,${this.user.photo}`; // Convierte Base64 a URL
        }
      },
      error: () => {
        this.alertService.ErrorAlert('Error al buscar');
      }
    })
  }

  listAlertsNotRead(id: number) {
    this.alertsService.getAlertsNotRead(id).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.alerts = data;

      }
    })
  }
  onDelete(id: number) {
    this.farmUserService.deleteFarmUsers(id).subscribe({
      next: (res: any) => {
        this.alertService.SuccessAlert('Eliminado con éxito');
      }
    })
  }
  acceptUser(id: number) {
    this.farmUserService.joinUser(id).subscribe({
      next: (res: any) => {
        this.alertService.SuccessAlert('Usuario aceptado');
      }
    })
  }
}
