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

import { MatButtonModule } from '@angular/material/button';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-categoria-suplemento',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTablesModule,CommonModule,FormsModule,
    MatIconModule,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './categoria-suplemento.component.html',
  styleUrl: './categoria-suplemento.component.css'
})
export class CategoriaSuplementoComponent implements OnInit{

dtoptions: Config={};
 dttrigger: Subject<any>= new Subject<any>();

 // referenicas del paginador y sort
 @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;

 constructor(private alertService:AlertService){}
  ngOnInit(): void {

    this.dtoptions={
      pagingType:'ful_numbers',
      lengthMenu:[5,10,15,20]
    };

  }

}
