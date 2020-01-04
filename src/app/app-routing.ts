import {ExtraOptions, Routes} from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'gene/:id',
    loadChildren: () => import('./modules/gene/gene.module').then(m => m.GeneModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./modules/about/about.module').then(m => m.AboutModule)
  },
  {
    path: 'developers',
    loadChildren: () => import('./modules/api-reference/api-reference.module').then(m => m.ApiReferenceModule)
  },
  {
    path: '404',
    loadChildren: () => import('./modules/404/404.module').then(m => m.Error404Module)
  },
  {
    path: '**', redirectTo: '/404'
  }
];

export const ROUTER_OPTIONS: ExtraOptions = {
  anchorScrolling: 'enabled'
};
