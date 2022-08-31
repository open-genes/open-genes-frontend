import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPanelComponent } from './filter-panel.component';
import { GeneFiltersPanelModule } from '../../../../../pages/genes-search-page/components/gene-filters-panel/gene-filters-panel.module';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../../../modules/vendors/material.module';

@NgModule({
  declarations: [
    FilterPanelComponent
  ],
  imports: [
    CommonModule,
    GeneFiltersPanelModule,
    TranslateModule,
    MaterialModule,
  ],
  exports: [FilterPanelComponent],
})
export class FilterPanelModule {}
