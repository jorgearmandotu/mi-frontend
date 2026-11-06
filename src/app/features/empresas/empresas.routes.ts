import { Routes } from '@angular/router';

export const EMPRESAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/empresas-list/empresas-list').then((m) => m.EmpresasList),
  },
  {
    path: 'nueva',
    loadComponent: () =>
      import('./pages/empresa-form/empresa-form').then((m) => m.EmpresaForm),
  },
];
