import {ExtraOptions, Routes} from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'gene/:id',
    loadChildren: () => import('./pages/gene/gene.module').then(m => m.GeneModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./pages/news/news.module').then(m => m.NewsModule)
  },
  {
    path: 'favourites',
    loadChildren: () => import('./pages/favourites/favourites.module').then(m => m.FavouritesModule)
  },
  {
    path: 'developers',
    loadChildren: () => import('./pages/api-reference/api-reference.module').then(m => m.ApiReferenceModule)
  },
  {
    path: 'go-search',
    loadChildren: () => import('./pages/go-search/go-search.module').then(m => m.GoSearchModule)
  },
  {
    path: '404',
    loadChildren: () => import('./pages/404/404.module').then(m => m.Error404Module)
  },
  {
    path: '**', redirectTo: '/404'
  }
];

export const ROUTER_OPTIONS: ExtraOptions = {
  anchorScrolling: 'enabled'
};
