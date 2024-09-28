import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoleViewService } from './role-view.service';
import { View } from '../views/view.module';
import { ViewService } from '../views/views.service';
import { RoleView } from './ViewRole.module';
import Swal from 'sweetalert2';
import { AlertService } from '../../../shared/components/alert.service';
import { RolesService } from '../role/roles.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Subject } from 'rxjs/internal/Subject';
import { Config } from 'datatables.net';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Modulo } from '../modules/modulo.module';

@Component({
  selector: 'app-role-view',
  standalone: true,
  imports: [CommonModule,FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
    templateUrl: './role-view.component.html'
})
export class RoleViewComponent implements OnInit {

  views: View[] = [];
  newView: View = { id: 0, name: '', description: '', route: '', moduleId: 0 };
  displayedColumns: string[] = ['id', 'name', 'description', 'route', 'moduloId', 'acciones'];
  dataSource!: MatTableDataSource<View>;
  dtoptions: Config={};
  dttrigger: Subject<any>= new Subject<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  modulos!: Modulo[];
  currentRole: { id: number, name: string } = { id: 0, name: '' };



  viewRole: any[] = [];
  newRoleModule: RoleView = {
    id: 0, roleId: 0, viewId: 0
  } 
 
  constructor( private roleViewService:RoleViewService, private roleService: RolesService, private viewRoleService: RoleViewService, private viewService: ViewService, private serviceAlert: AlertService,) { }

  ngOnInit(): void {
    this.roleService.currentRole.subscribe(role => {
      this.currentRole = role;
      this.newRoleModule.roleId = role.id
    });
    this.listViewRole();
    this.listViews();
  }

  listViews(): void {
    this.viewService.getViews().subscribe({
      next: (views: View[]) => {
        this.views = views;
      },
      error: (err) => {
        this.serviceAlert.ErrorAlert('Algo salió mal')
      }
    })
  }

  listViewRole(): void {
    this.viewRoleService.getViewRole(this.currentRole.id).subscribe({
      next: (res: View[]) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.views = res;
      },
      error: (error) => {
        this.serviceAlert.ErrorAlert('Algo salió mal')
      }
    })
  }

  onDelete(id:number): void {
    this.serviceAlert.DeleteAlert().then((res)=>{
      if(res.isConfirmed){
        this.roleViewService.onDelete(id).subscribe({
          next: ()=>{
            this.serviceAlert.SuccessAlert('Eliminado correctamente');
            this.listViewRole();
          },
          error: ()=>{
            this.serviceAlert.ErrorAlert('Error al eliminar');
          }
        });
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.newRoleModule.id) {
        this.viewRoleService.updateRoleView(this.newRoleModule, this.newRoleModule.id).subscribe({
          next: (res) => {
            this.serviceAlert.SuccessAlert('Actualizado con éxito!')

            form.reset()
            this.newRoleModule = { id: 0, roleId: 0, viewId: 0,}
            this.listViewRole();
          },
          error: (err) => {
            this.serviceAlert.ErrorAlert('Algo salió mal')
          }
        })
      } else {
        this.viewRoleService.createRoleView(this.newRoleModule).subscribe({
          next: (res) => {
            this.serviceAlert.SuccessAlert('Guardado con éxito!')
            form.reset();
            this.listViewRole();
          },
          error: (err) => {
            this.serviceAlert.ErrorAlert('Algo salió mal')
          }
        })
      }
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
