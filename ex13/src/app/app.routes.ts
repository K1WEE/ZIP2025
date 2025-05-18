import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { InfomationComponent } from './features/infomation/infomation.component';
import { NopageComponent } from './features/nopage/nopage.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },{
        path: 'info/:id',
        component: InfomationComponent,
    },
    {
        path: '**',
        component: NopageComponent,
    }
];
