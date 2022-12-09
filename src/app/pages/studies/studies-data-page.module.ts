import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudiesDataPageComponent } from './studies-data-page.component';
import { RouterModule } from '@angular/router';
import { RESEARCHES_ROUTES } from './studies-data-page-routing';
import { GenesListModule } from '../../components/shared/genes-list/genes-list.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../modules/pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';
import { MatIconModule } from '@angular/material/icon';
import { NoContentModule } from '../../components/shared/no-content/no-content.module';
import { IconModule } from '../../components/ui-components/components/icon/app-icon.module';
import { MaterialModule } from '../../modules/vendors/material.module';
import { NgCapitalizePipeModule, NgTrimPipeModule } from 'angular-pipes';
import { ResearchTablesModule } from '../../components/shared/research-tables/research-tables.module';
import { StudiesListComponent } from './components/studies-list/studies-list.component';
import { StudiesFiltersPanelModule } from './components/filters-panel/studies-filters-panel.module';
import { SearchModule } from '../../components/shared/search/search.module';
import { SidebarModule } from '../../components/shared/sidebar/sidebar.module';

@NgModule({
  declarations: [StudiesDataPageComponent, StudiesListComponent],
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
    StudiesFiltersPanelModule,
    SearchModule,
    SidebarModule,
  ],
  exports: [PipesModule],
})
export class StudiesDataPageModule {}
