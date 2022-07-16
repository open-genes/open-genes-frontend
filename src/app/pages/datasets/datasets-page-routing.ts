import { Routes } from '@angular/router';
import { DatasetsPageComponent } from './datasets-page.component';


export const DATASETS_PAGE_ROUTES: Routes = [
  {
    path: '',
    component: DatasetsPageComponent,
    children: [
      {
        path: 'calorie-restriction',
        loadChildren: () => import('./diet/diet.module').then((m) => m.DietModule),
      },
      {
        path: 'horvath-clock',
        loadChildren: () => import('./horvath-clock/horvath-clock.module').then((m) => m.HorvathClockModule),
      },
    ],
  },
];
