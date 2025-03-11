import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenesListComponent } from './genes-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SearchModule } from '../search/search.module';
import { PipesModule } from '../../../core/pipes/pipes.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { WindowService } from '../../../core/services/browser/window.service';
import { MaterialModule } from '../../../modules/third-party/material.module';
import { GeneMenuComponent } from './components/gene/menu/gene-menu.component';
import { SelectionCriteriaModule } from '../selection-criteria/selection-criteria.module';
import { GenesTableHeaderComponent } from './components/genes-table-header/genes-table-header.component';
import { GeneCardComponent } from './components/gene/gene-card/gene-card.component';
import { GeneTableRowComponent } from './components/gene/gene-table-row/gene-table-row.component';
import { GeneAnnotationsCardComponent } from './components/gene/gene-annotations-card/gene-annotations-card.component';
import { GeneAnnotationsTableRowComponent } from './components/gene/gene-annotations-table-row/gene-annotations-table-row.component';
import { GenesAnnotationsTableHeaderComponent } from './components/genes-annotations-table-header/genes-annotations-table-header.component';
import { SearchViewPanelComponent } from './components/search-view-panel/search-view-panel.component';
import { ProteinClassesModule } from '../protein-classes/protein-classes.module';
import { FilterPanelModule } from './components/filter-panel/filter-panel.module';
import { SpinnerComponent } from '../../ui-components/spinner/spinner.component';
import { IconComponent } from '../../ui-components/icon/app-icon.component';
import {GeneAgeComponent} from "../gene-age/gene-age.component";
import { TagComponent } from '../../ui-components/tag/tag.component';
import { AgingMechanismsComponent } from '../aging-mechanisms/aging-mechanisms.component';
import { AssociatedDiseaseCategoriesComponent } from '../associated-disease-categories/associated-disease-categories.component';
import { AssociatedDiseasesComponent } from '../associated-diseases/associated-diseases.component';
import { ExperimentsStatsComponent } from '../experiments-stats/experiments-stats.component';
import { NoContentComponent } from '../no-content/no-content.component';

@NgModule({
  declarations: [
    GenesListComponent,
    GeneMenuComponent,
    GenesTableHeaderComponent,
    GenesAnnotationsTableHeaderComponent,
    GeneCardComponent,
    GeneTableRowComponent,
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
    SelectionCriteriaModule,
    MaterialModule,
    ProteinClassesModule,
    FilterPanelModule,
    SpinnerComponent,
    IconComponent,
    GeneAgeComponent,
    TagComponent,
    AgingMechanismsComponent,
    AssociatedDiseaseCategoriesComponent,
    AssociatedDiseasesComponent,
    ExperimentsStatsComponent,
    NoContentComponent,
  ],
  providers: [WindowService],
  exports: [GenesListComponent, GeneCardComponent, GeneTableRowComponent],
})
export class GenesListModule {}
