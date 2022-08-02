import { Routes } from '@angular/router';
import { ExperimentsDataPageComponent } from './experiments-data-page.component';

export const RESEARCHES_ROUTES: Routes = [
  {
    path: '',
    component: ExperimentsDataPageComponent,
    data: {
      breadcrumb: 'search_by_research_data',
    },
  },
];
