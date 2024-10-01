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
import { AlertaComponent } from './pages/operational/alerta/alerta.component';
import { AnimalComponent } from './pages/operational/animal/animal.component';
import { MenuComponent } from './features/pages/menu/menu.component';
import { FincaComponent } from './pages/operational/finca/finca.component';
// import { NacimientoComponent } from './pages/operational/nacimiento/nacimiento.component';
import { LoteComponent } from './pages/operational/lote/lote.component';
import { ContinentComponent } from './features/Parameter/continent/continent.component';
import { CountryComponent } from './features/Parameter/country/country.component';
import { DepartamentComponent } from './features/Parameter/departament/departament.component';
import { CityComponent } from './features/Parameter/city/city.component';
// import { CityComponent } from './features/Parameter/city/city.component';
import { InseminationComponent } from './pages/operational/inseminacion/inseminacion.component';
// import { InventarioComponent } from './pages/operational/inventario/inventario.component';
import { ProduccionComponent } from './pages/operational/produccion/produccion.component';
import { VentasComponent } from './pages/operational/ventas/ventas.component';
// import { TratamientoComponent } from './pages/operational/tratamiento/tratamiento.component';
// import { CategoriaAlertaComponent } from './pages/Parametro/categoria-alerta/categoria-alerta.component';
// import { CategoriaMedicinaComponent } from './pages/Parametro/categoria-medicina/categoria-medicina.component';
// import { CategoriaSuplementoComponent } from './pages/Parametro/categoria-suplemento/categoria-suplemento.component';
// import { MedicinaComponent } from './pages/Parametro/medicina/medicina.component';
// import { SuplementosComponent } from './pages/Parametro/suplementos/suplementos.component';

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

            // SECURITY
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

            // OPERATIONAL
            {
                path: 'alerta',
                component: AlertaComponent
            },
            {
                path: 'animales',
                component: AnimalComponent
            },
            // {
            //     path:'nacimiento',
            //     component:NacimientoComponent
            // },
            {
                path:'inseminacion',
                component: InseminationComponent
            },
            // {
            //     path:'inventario',
            //     component: InventarioComponent
            // },  
            {
                path:'finca',
                component: FincaComponent
            },
            {
                path:'lote',
                component:LoteComponent
            },
            {
                path:'produccion',
                component:ProduccionComponent
            },
            {
                path:'venta',
                component: VentasComponent
            },
            // {
            //     path:'tratamientos',
            //     component: TratamientoComponent
            // },

            // //LOCALITATION
            {
                path: 'continent',
                component: ContinentComponent
            },
            {
                path: 'pais',
                component: CountryComponent
            },
            {
                path: 'departamento',
                component: DepartamentComponent
            },
            {
                path:'ciudad',
                component: CityComponent
            },

            // //PARAMETER
            // {
            //     path:'categoria-alerta',
            //     component: CategoriaAlertaComponent
            // },
            // {
            //     path:'categoria-medicina',
            //     component: CategoriaMedicinaComponent
            // },
            // {
            //     path:'categoria-suplemento',
            //     component: CategoriaSuplementoComponent
            // },
            // {
            //     path:'Medicina',
            //     component: MedicinaComponent
            // },
            // {
            //     path:'Suplementos',
            //     component: SuplementosComponent
            // },

        ]
    }
];
