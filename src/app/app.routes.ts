import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path : '',
        pathMatch: 'full',
        loadComponent: () => 
        import('./home/home').then(m => m.Home),

    },
    {
        path : 'dashboard',
        pathMatch: 'full',
        loadComponent: () => 
        import('./dashboard/dashboard').then(m => m.Dashboard),

    },

    


];
