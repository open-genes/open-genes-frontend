import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { HOME_ROUTES } from './home-routing';
import { GenesListModule } from '../../components/shared/genes-list/genes-list.module';
import { MiniCardsComponent } from '../../components/mini-cards/mini-cards.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgStripTagsPipeModule } from 'angular-pipes';
import { PipesModule } from '../../modules/pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';
import { NewsListModule } from '../../components/shared/news-list/news-list.module';
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';
import { ArticlesListModule } from '../../components/shared/articles-list/articles-list.module';
import { SidebarModule } from '../../components/shared/sidebar/sidebar.module';
import { MatIconModule } from '@angular/material/icon';
import { WizardModule } from '../../components/shared/wizard/wizard.module';
import { NoContentModule } from '../../components/shared/no-content/no-content.module';
import { IconModule } from '../../components/ui-components/components/icon/app-icon.module';
import { ToggleSearchModeModule } from '../../components/shared/toggle-search-mode/toggle-search-mode.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GeneFieldsModalModule } from "../../components/shared/gene-fields-modal/gene-fields-modal.module";


@NgModule({
  declarations: [HomeComponent, MiniCardsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(HOME_ROUTES),
    GenesListModule,
    TranslateModule,
    NgStripTagsPipeModule,
    PipesModule,
    MatButtonModule,
    NewsListModule,
    UiComponentsModule,
    ArticlesListModule,
    SidebarModule,
    MatIconModule,
    WizardModule,
    NoContentModule,
    IconModule,
    ToggleSearchModeModule,
    MatProgressBarModule,
    GeneFieldsModalModule
  ],
  exports: [PipesModule],
})
export class HomeModule {}
