import { Routes } from '@angular/router';
import { IncreaseLifespanComponent } from './increase-lifespan.component';

export const RESEARCHES_ROUTES: Routes = [
  {
    path: '',
    component: IncreaseLifespanComponent,
    data: {
      breadcrumb: 'search_by_researches',
    },
  },
];