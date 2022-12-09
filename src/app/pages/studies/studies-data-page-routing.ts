import { Routes } from '@angular/router';
import { StudiesDataPageComponent } from './studies-data-page.component';

export const RESEARCHES_ROUTES: Routes = [
  {
    path: '',
    component: StudiesDataPageComponent,
    data: {
      breadcrumb: 'search_by_research_data',
    },
  },
];
