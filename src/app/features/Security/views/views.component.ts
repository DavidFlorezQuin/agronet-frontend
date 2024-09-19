import { Component, OnInit } from '@angular/core';
import { ViewService } from './views.service';
import { View } from './view.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { Modulo } from '../modules/modulo.module';
import { AlertService } from '../../../shared/components/alert.service';
import { ModuleService } from '../modules/module.service';



@Component({
  selector: 'app-views',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTablesModule],
  templateUrl: './views.component.html',
  styles: ``
})
export class ViewsComponent implements OnInit {

  dtoptions: Config={}
  dttrigger: Subject<any> = new  Subject<any>();

  newView: View = { id: 0, name: '', description: '', route: '',
     moduleId:{id: 0,name: '',description: ''} };

  modules: any[] = [];

  views: any[] = [];

  constructor(private serviceView: ViewService, private moduleService: ModuleService, private serviceAlert: AlertService) { }

  ngOnInit(): void {
    this.dtoptions={
      pagingType: "full_numbers",
      lengthMenu: [5,10,15,20]
    };
    this.getViews();
    this.getModules();
  }

  getViews(): void {
    this.serviceView.getViews().subscribe({
      next: (views: View[]) => {
        this.views = views
        this.dttrigger.next(null);
      },
      error: (error) => {
        this.serviceAlert.ErrorAlert('Algo salió mal')
      }
    }
    );
  }

  getModules(): void {
    this.moduleService.getModules().subscribe({
      next: (modules: Modulo[]) => {
        this.modules = modules;
      },
      error: (error) => {
        this.serviceAlert.ErrorAlert('Algo salió mal')
      }
    })
  }

  onSubmit(form: any): void {
    if (form.valid) {

      if (this.newView.id) {
        this.serviceView.updateViews(this.newView, this.newView.id).subscribe({
          next: (res) => {
            this.serviceAlert.SuccessAlert('Actualizado con éxito!');
            form.reset();
            this.newView = { id: 0, name: '', description: '', route: '', moduleId:{id: 0,name: '',description: ''} }
            this.getViews();
          },
          error: (err) => {
            this.serviceAlert.ErrorAlert('Algo salió mal')
          }
        })
      } else {
        this.serviceView.createViews(this.newView).subscribe({
          next: (res) => {
            this.serviceAlert.SuccessAlert('Guardado con éxito!')
            form.reset();
            this.getViews();
          },
          error: (err) => {
            console.log('error', err);

          }
        })
      }
    }
  }

  onDelete(id: number): void {
    this.serviceAlert.DeleteAlert().then((res)=>{
      if(res.isConfirmed){
        this.serviceView.deleteViews(id).subscribe({
          next:()=>{
            this.serviceAlert.SuccessAlert('Eliminado con exito');
          }, 
          error: ()=>{
            this.serviceAlert.ErrorAlert('Algo salió mal')
          }
        })
      }
    })
  }

  onEdit(view: View): void {
    this.newView = { ...view }

  }


}
