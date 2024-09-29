import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { AlertService } from '../../../shared/components/alert.service';

@Component({
  selector: 'app-suplementos',
  standalone: true,
  imports: [CommonModule, FormsModule,

    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './suplementos.component.html',
  styleUrls: ['./suplementos.component.css']
})
export class SuplementosComponent {
  /**displayedColumns:string[] = ['id','name','gender','weight','photo','race','purpuse','birthDay', 'LotId','state'];
  dataSource: MatTableDataSource<Animal> = new MatTableDataSource<Animal>();
  dtoptions: Config={};
  dttrigger: Subject<any>= new Subject<any>();
  animales: Animal[] = [];
  newAnimales: Animal = {id: 0, name:'',weight:0,photo:'',raceId:0,purpose:'',
    birthDay: new Date(),state: true,LotId: 0 };

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    */

}
