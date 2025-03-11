import { ExtraOptions, Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'gene/:id',
    loadChildren: () => import('./pages/gene/gene.module').then((m) => m.GeneModule),
  },
  {
    path: 'favorites',
    loadChildren: () => import('./pages/favourites/favourites.module').then((m) => m.FavouritesModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then((m) => m.SettingsModule),
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/help/help-page.module').then((m) => m.HelpPageModule),
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
    loadChildren: () => import('./pages/download/download-page.module').then((m) => m.DownloadPageModule),
  },
  {
    path: 'experiments',
    loadChildren: () =>
      import('./pages/experiments-data/experiments-data-page.module').then((m) => m.ExperimentsDataPageModule),
  },
  {
    path: 'genes',
    loadChildren: () =>
      import('./pages/genes-search-page/genes-search-page.module').then((m) => m.GenesSearchPageModule),
  },
  {
    path: 'annotations',
    loadChildren: () => import('./pages/go-search-page/go-search-page.module').then((m) => m.GoSearchPageModule),
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
  onSameUrlNavigation: 'reload',
  scrollPositionRestoration: 'top'
};
