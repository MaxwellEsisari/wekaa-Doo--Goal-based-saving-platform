import { Routes } from '@angular/router';
import { RoleGuard } from './services/role-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./home/home').then((m) => m.Home),
  },
  {
    path: 'dashboard',
    canActivate: [RoleGuard],
    loadComponent: () =>
      import('./home/home').then((m) => m.Home), // placeholder
  },
  {
    path: 'user-dashboard',
    canActivate: [RoleGuard],
    data: { role: 'ROLE_USER' }, // 👈 only for USER
    loadComponent: () =>
      import('./user-dashboard/user-dashboard').then((m) => m.UserDashboard),
  },
  {
    path: 'admin-dashboard',
    canActivate: [RoleGuard],
    data: { role: 'ROLE_ADMIN' }, // 👈 only for ADMIN
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
  },
  {
    path: '**',
    redirectTo: '', // catch unknown routes
  },
];
