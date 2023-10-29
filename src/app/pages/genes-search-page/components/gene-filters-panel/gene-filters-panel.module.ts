import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../../vendors/material.module';
import { GeneFiltersPanelComponent } from './gene-filters-panel.component';
import { UiComponentsModule } from '../../../../components/ui-components/ui-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../../../core/pipes/pipes.module';
import { SelectSearchComponent } from './select-search/select-search.component';
import { DirectivesModule } from '../../../../core/directives/directives.module';

@NgModule({
  declarations: [GeneFiltersPanelComponent, SelectSearchComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialModule,
    UiComponentsModule,
    ReactiveFormsModule,
    TranslateModule,
    PipesModule,
    FormsModule,
    DirectivesModule,
  ],
  exports: [GeneFiltersPanelComponent],
})
export class GeneFiltersPanelModule {}
