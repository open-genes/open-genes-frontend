import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperimentsDataPageComponent } from './experiments-data-page.component';
import { RouterModule } from '@angular/router';
import { RESEARCHES_ROUTES } from './experiments-data-page-routing';
import { GenesListModule } from '../../components/shared/genes-list/genes-list.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';
import { MatIconModule } from '@angular/material/icon';
import { NoContentModule } from '../../components/shared/no-content/no-content.module';
import { IconModule } from '../../components/ui-components/components/icon/app-icon.module';
import { NgCapitalizePipeModule, NgTrimPipeModule } from 'angular-pipes';
import { ResearchTablesModule } from '../../components/shared/research-tables/research-tables.module';
import { ResearchTabComponent } from './components/research-tab/research-tab.component';
import { ResearchFiltersPanelModule } from './components/filters-panel/research-filters-panel.module';
import { SearchModule } from '../../components/shared/search/search.module';
import { SidebarModule } from '../../components/shared/sidebar/sidebar.module';
import { PipesModule } from '../../core/pipes/pipes.module';
import { MaterialModule } from '../../vendors/material.module';

@NgModule({
  declarations: [ExperimentsDataPageComponent, ResearchTabComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(RESEARCHES_ROUTES),
    GenesListModule,
    TranslateModule,
    PipesModule,
    MatButtonModule,
    UiComponentsModule,
    MatIconModule,
    NoContentModule,
    IconModule,
    MaterialModule,
    NgCapitalizePipeModule,
    NgTrimPipeModule,
    ResearchTablesModule,
    ResearchFiltersPanelModule,
    SearchModule,
    SidebarModule,
  ],
  exports: [PipesModule],
})
export class ExperimentsDataPageModule {}
