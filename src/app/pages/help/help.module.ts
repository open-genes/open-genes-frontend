import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpComponent } from './help.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../vendors/material.module';
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';
import { EntitiesComponent } from './entities/entities.component';
import { HELP_ROUTES } from './help-routing';
import { NgToArrayPipeModule } from 'angular-pipes';
import { SidebarModule } from '../../components/shared/sidebar/sidebar.module';
import { WpArticlesComponent } from './wp-articles/wp-articles.component';
import { NoContentModule } from '../../components/shared/no-content/no-content.module';
import { IconModule } from '../../components/ui-components/components/icon/app-icon.module';
import { PipesModule } from '../../core/pipes/pipes.module';
import { WpArticleComponent } from './wp-article/wp-article.component';
import { DirectivesModule } from "../../core/directives/directives.module";

@NgModule({
  declarations: [HelpComponent, EntitiesComponent, WpArticlesComponent, WpArticleComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(HELP_ROUTES),
    TranslateModule,
    MaterialModule,
    UiComponentsModule,
    NgToArrayPipeModule,
    SidebarModule,
    NoContentModule,
    IconModule,
    PipesModule,
    DirectivesModule
  ]
})
export class HelpModule {}
