import { Routes } from '@angular/router';
import { HelpComponent } from './help.component';
import { EntitiesComponent } from './entities/entities.component';

export const HELP_ROUTES: Routes = [
  {
    path: '',
    component: HelpComponent,
  },
  {
    path: ':slug',
    component: EntitiesComponent,
    data: {
      breadcrumb: 'entities_breadcrumb',
    },
  },
];
