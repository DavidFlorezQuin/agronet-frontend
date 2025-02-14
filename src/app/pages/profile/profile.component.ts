import { Component } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { RouterOutlet } from '@angular/router';
import { SettingsProfileComponent } from './settings-profile/settings-profile.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MenuComponent, RouterOutlet,SettingsProfileComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
