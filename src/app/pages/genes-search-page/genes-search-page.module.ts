import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenesSearchPageComponent } from './genes-search-page.component';
import { RouterModule, Routes } from '@angular/router';
import { GenesListModule } from '../../components/shared/genes-list/genes-list.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgStripTagsPipeModule } from 'angular-pipes';
import { PipesModule } from '../../core/pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';
import { NewsListModule } from '../../components/shared/news-list/news-list.module';
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';
import { ArticlesListModule } from '../../components/shared/articles-list/articles-list.module';
import { SidebarModule } from '../../components/shared/sidebar/sidebar.module';
import { MatIconModule } from '@angular/material/icon';
import { WizardModule } from '../../components/shared/wizard/wizard.module';
import { NoContentModule } from '../../components/shared/no-content/no-content.module';
import { IconModule } from '../../components/ui-components/components/icon/app-icon.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GeneFiltersPanelModule } from './components/gene-filters-panel/gene-filters-panel.module';
import { SearchModule } from '../../components/shared/search/search.module';

const routes: Routes = [{ path: '', component: GenesSearchPageComponent }];

@NgModule({
  declarations: [GenesSearchPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
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
    MatProgressBarModule,
    GeneFiltersPanelModule,
    SearchModule,
  ],
  exports: [PipesModule],
})
export class GenesSearchPageModule {}
