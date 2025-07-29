import { Routes } from '@angular/router';
import { HelpPageComponent } from './help-page.component';
import { EntitiesComponent } from './entities/entities.component';
import { WpArticleComponent } from './wp-article/wp-article.component';

export const HELP_ROUTES: Routes = [
  {
    path: '',
    component: HelpPageComponent,
  },
  {
    path: 'entities/:slug',
    component: EntitiesComponent,
    data: {
      breadcrumb: 'entities_breadcrumb',
    },
  },
  {
    path: 'articles/:slug',
    component: WpArticleComponent,
    pathMatch: 'full',
    data: {
      breadcrumb: 'articles_breadcrumb',
    },
  },
];
