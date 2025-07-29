import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpPageComponent } from './help-page.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EntitiesComponent } from './entities/entities.component';
import { HELP_ROUTES } from './help-routing';
import { NgToArrayPipeModule } from 'angular-pipes';
import { SidebarModule } from '../../components/shared/sidebar/sidebar.module';
import { WpArticlesComponent } from './wp-articles/wp-articles.component';
import { PipesModule } from '../../core/pipes/pipes.module';
import { WpArticleComponent } from './wp-article/wp-article.component';
import { DirectivesModule } from "../../directives/directives.module";
import { BreadcrumbsComponent } from '../../components/ui-components/breadcrumbs/breadcrumbs.component';
import { HintComponent } from '../../components/ui-components/hint/hint.component';
import { MaterialModule } from '../../modules/third-party/material.module';
import { IconComponent } from '../../components/ui-components/icon/app-icon.component';
import { SkeletonLoaderComponent } from '../../components/ui-components/skeleton/skeleton.component';
import { NoContentComponent } from '../../components/shared/no-content/no-content.component';

@NgModule({
  declarations: [HelpPageComponent, EntitiesComponent, WpArticlesComponent, WpArticleComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(HELP_ROUTES),
    TranslateModule,
    MaterialModule,
    NgToArrayPipeModule,
    SidebarModule,
    PipesModule,
    DirectivesModule,
    BreadcrumbsComponent,
    HintComponent,
    MaterialModule,
    IconComponent,
    SkeletonLoaderComponent,
    NoContentComponent,
  ],
})
export class HelpPageModule {}
