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
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UiComponentsModule } from '../../ui-components/ui-components.module';
import { MatCardModule } from '@angular/material/card';
import { WindowService } from '../../../core/services/browser/window.service';
import { GeneMenuComponent } from './components/gene/menu/gene-menu.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectionCriteriaModule } from '../selection-criteria/selection-criteria.module';
import { MaterialModule } from '../../../modules/vendors/material.module';
import { GenesTableHeaderComponent } from './components/genes-table-header/genes-table-header.component';
import { AssociatedDiseasesModule } from '../associated-diseases/associated-diseases.module';
import { AssociatedDiseaseCategoriesModule } from '../associated-disease-categories/associated-disease-categories.module';
import { GenesCardComponent } from './components/genes-card/genes-card.component';
import { GenesTableRowComponent } from './components/genes-table-row/genes-table-row.component';
import { FieldsForShowComponent } from './components/fields-for-show/fields-for-show.component';
import { NoContentModule } from '../no-content/no-content.module';
import { IconModule } from '../../ui-components/components/icon/app-icon.module';

@NgModule({
  declarations: [
    GenesListComponent,
    SearchComponent,
    GeneMenuComponent,
    GenesTableHeaderComponent,
    GenesCardComponent,
    GenesTableRowComponent,
    FieldsForShowComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    SearchModule,
    PipesModule,
    DirectivesModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    UiComponentsModule,
    MatCardModule,
    MatTooltipModule,
    SelectionCriteriaModule,
    MaterialModule,
    AssociatedDiseasesModule,
    AssociatedDiseaseCategoriesModule,
    NoContentModule,
    IconModule,
  ],
  providers: [WindowService],
  exports: [GenesListComponent, SearchComponent, GenesCardComponent, GenesTableRowComponent],
})
export class GenesListModule {}
