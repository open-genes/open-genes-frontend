import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPanelComponent } from './filter-panel.component';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../../../vendors/material.module';

@NgModule({
  declarations: [
    FilterPanelComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialModule,
  ],
  exports: [FilterPanelComponent],
})
export class FilterPanelModule {}
