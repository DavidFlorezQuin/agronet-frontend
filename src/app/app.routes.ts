import { Routes } from '@angular/router';

import { LoginComponent } from './features/login/login.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './features/pages/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { AboutComponent } from './features/pages/about/about.component';
import { RoleViewComponent } from './features/Security/role-view/role-view.component';
import { UserRoleComponent } from './features/Security/user-role/user-role.component';
import { RoleComponent } from './features/Security/role/role.component';
import { ModulesComponent } from './features/Security/modules/modules.component';
import { ViewsComponent } from './features/Security/views/views.component';
import { UsersComponent } from './features/Security/users/users.component';
import { PersonComponent } from './features/Security/person/person.component';
import { HomeComponentD } from './features/Security/home/home.component';
import { FincaComponent } from './pages/operational/finca/finca.component';
import { AnimalComponent } from './pages/operational/animal/animal.component';
import { NacimientoComponent } from './pages/operational/nacimiento/nacimiento.component';
import { LoteComponent } from './pages/operational/lote/lote.component';
import { MenuComponent } from './features/pages/menu/menu.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'about',
        component: AboutComponent,
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        component: HomeComponent
    }, {
      path: 'menu',
      component: MenuComponent
  },
    {
        path: 'dashboard',
        component: MainComponent,
        children: [

            {
                path: 'role-view',
                component: RoleViewComponent
            },
            {
                path: 'user-rol',
                component: UserRoleComponent
            },

            {
                path: 'role',
                component: RoleComponent
            },
            {
                path: 'modulo',
                component: ModulesComponent
            },
            {
                path: 'vista',
                component: ViewsComponent
            },
            {
                path: 'usuario',
                component: UsersComponent
            },
            {
                path: 'rol-vista',
                component: RoleViewComponent
            },
            {
                path: 'persona',
                component: PersonComponent
            },
            {
                path: '',
                component: HomeComponentD
            },
            {
                path:'finca',
                component: FincaComponent
            },
            {
                path:'animal',
                component:AnimalComponent
            },
            {
                path:'nacimiento',
                component:NacimientoComponent
            },
            {
                path:'lote',
                component:LoteComponent
            }
        ]
    }
];
