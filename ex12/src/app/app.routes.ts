import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NopageComponent } from './nopage/nopage.component';
import { InfomationComponent } from './infomation/infomation.component';


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
