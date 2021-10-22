import { ExtraOptions, Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'gene/:id',
    loadChildren: () => import('./pages/gene/gene.module').then((m) => m.GeneModule),
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then((m) => m.AboutModule),
  },
  {
    path: 'news',
    loadChildren: () => import('./pages/news/news.module').then((m) => m.NewsModule),
  },
  {
    path: 'favourites',
    loadChildren: () => import('./pages/favourites/favourites.module').then((m) => m.FavouritesModule),
  },
  // {
  //   path: 'developers',
  //   loadChildren: () => import('./pages/api-reference/api-reference.module').then((m) => m.ApiReferenceModule),
  // },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then((m) => m.SettingsModule),
  },
  {
    path: 'diagrams',
    loadChildren: () => import('./pages/diagrams/diagrams.module').then((m) => m.DiagramsModule),
  },
  {
    path: 'help',
    loadChildren: () => import('./pages/help/help.module').then((m) => m.HelpModule),
  },
  {
    path: 'contributors',
    loadChildren: () => import('./pages/contributors/contributors.module').then((m) => m.ContributorsModule),
  },
  {
    path: 'timeline',
    loadChildren: () => import('./pages/timeline-page/timeline-page.module').then((m) => m.TimelinePageModule),
  },
  {
    path: 'download',
    loadChildren: () => import('./pages/download/download.module').then((m) => m.DownloadModule),
  },
  {
    path: 'by-researches',
    loadChildren: () => import('./pages/increase-lifespan/increase-lifespan.module').then((m) => m.IncreaseLifespanModule),
  },
  {
    path: '404',
    loadChildren: () => import('./pages/404/404.module').then((m) => m.Error404Module),
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];

export const ROUTER_OPTIONS: ExtraOptions = {
  anchorScrolling: 'enabled',
};
