import { Routes } from '@angular/router';
import { RoleGuard } from './services/role-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./home/home').then(m => m.Home) },
  { path: 'dashboard', canActivate: [RoleGuard], loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard) },
  { path: '**', redirectTo: '' }
];

