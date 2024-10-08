import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Route, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RoleMenu } from '../../login/models/MenuRole.module';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  id:number = 0; 

  constructor(private serviceAuth:AuthService){
    const storedId = localStorage.getItem('menuId'); 
    if(storedId !== null){
      this.id = Number(storedId)
    }else{
      this.id = this.serviceAuth.getRoleMenu();
      localStorage.setItem('menuId', this.id.toString());
    }
    this.loadMenu(this.id);
  }


  
  menuData: RoleMenu[] = [];

  loadMenu(id: number): void {
    this.serviceAuth.menu(id).subscribe({
      next: (res: RoleMenu[]) => {
        this.menuData = res;
        console.log(this.menuData); 
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
