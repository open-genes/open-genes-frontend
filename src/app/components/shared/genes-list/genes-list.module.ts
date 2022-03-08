import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenesListComponent } from './genes-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SearchModule } from '../search/search.module';
import { PipesModule } from '../../../modules/pipes/pipes.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { UiComponentsModule } from '../../ui-components/ui-components.module';
import { WindowService } from '../../../core/services/browser/window.service';
import { GeneMenuComponent } from './components/gene/menu/gene-menu.component';
import { SelectionCriteriaModule } from '../selection-criteria/selection-criteria.module';
import { MaterialModule } from '../../../modules/vendors/material.module';
import { GenesTableHeaderComponent } from './components/genes-table-header/genes-table-header.component';
import { AssociatedDiseasesModule } from '../associated-diseases/associated-diseases.module';
import { AssociatedDiseaseCategoriesModule } from '../associated-disease-categories/associated-disease-categories.module';
import { NoContentModule } from '../no-content/no-content.module';
import { IconModule } from '../../ui-components/components/icon/app-icon.module';
import { GeneCardComponent } from './components/gene/gene-card/gene-card.component';
import { GeneTableRowComponent } from './components/gene/gene-table-row/gene-table-row.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { GeneAnnotationsCardComponent } from './components/gene/gene-annotations-card/gene-annotations-card.component';
import { GeneAnnotationsTableRowComponent } from './components/gene/gene-annotations-table-row/gene-annotations-table-row.component';
import { GenesAnnotationsTableHeaderComponent } from './components/genes-annotations-table-header/genes-annotations-table-header.component';
import { SearchViewPanelComponent } from './components/search-view-panel/search-view-panel.component';
import { AgingMechanismsModule } from '../aging-mechanisms/aging-mechanisms.module';
import { ProteinClassesModule } from '../protein-classes/protein-classes.module';
import { GeneFieldsModalModule } from '../gene-fields-modal/gene-fields-modal.module';

@NgModule({
  declarations: [
    GenesListComponent,
    SearchComponent,
    GeneMenuComponent,
    GenesTableHeaderComponent,
    GenesAnnotationsTableHeaderComponent,
    GeneCardComponent,
    GeneTableRowComponent,
    FilterPanelComponent,
    GeneAnnotationsCardComponent,
    GeneAnnotationsTableRowComponent,
    SearchViewPanelComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    SearchModule,
    PipesModule,
    DirectivesModule,
    UiComponentsModule,
    SelectionCriteriaModule,
    MaterialModule,
    AssociatedDiseasesModule,
    AssociatedDiseaseCategoriesModule,
    NoContentModule,
    IconModule,
    AgingMechanismsModule,
    ProteinClassesModule,
    GeneFieldsModalModule,
  ],
  providers: [WindowService],
  exports: [GenesListComponent, SearchComponent, GeneCardComponent, GeneTableRowComponent],
})
export class GenesListModule {}
