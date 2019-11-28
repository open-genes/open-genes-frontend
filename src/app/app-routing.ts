import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {path: '', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)},
  {path: 'gene/:id', loadChildren: () => import('./modules/gene/gene.module').then(m => m.GeneModule)}
];
