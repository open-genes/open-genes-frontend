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
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then((m) => m.SettingsModule),
  },
  {
    path: 'help',
    loadChildren: () => import('./pages/help/help.module').then((m) => m.HelpModule),
    data: {
      breadcrumb: 'header_menu_help',
    },
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
    path: 'researches',
    loadChildren: () => import('./pages/researches/researches-page.module').then((m) => m.ResearchesPageModule),
  },
  {
    path: 'datasets',
    loadChildren: () => import('./pages/datasets/datasets-page.module').then((m) => m.DatasetsPageModule),
    data: {
      breadcrumb: 'header_menu_datasets',
    },
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
  relativeLinkResolution: 'legacy',
};
