import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { InfomationComponent } from './features/infomation/infomation.component';
import { NopageComponent } from './features/nopage/nopage.component';
import { LoginComponent } from './features/login/login.component';
import { ProfileComponent } from './features/profile/profile.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },{
        path: 'info/:id',
        component: InfomationComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    }
    ,{
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard],
    },
    {
        path: '**',
        component: NopageComponent,
    }
];
