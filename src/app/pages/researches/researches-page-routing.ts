import { Routes } from '@angular/router';
import { ResearchesPageComponent } from './researches-page.component';

export const RESEARCHES_ROUTES: Routes = [
  {
    path: '',
    component: ResearchesPageComponent,
    data: {
      breadcrumb: 'search_by_researches',
    },
  },
];