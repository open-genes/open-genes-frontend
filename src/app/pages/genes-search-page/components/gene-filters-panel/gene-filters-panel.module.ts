import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../../modules/third-party/material.module';
import { GeneFiltersPanelComponent } from './gene-filters-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../../../core/pipes/pipes.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import { SelectSearchComponent } from './select-search/select-search.component';
import { EyeCheckboxComponent } from '../../../../components/ui-components/eye-checkbox/eye-checkbox.component';

@NgModule({
  declarations: [GeneFiltersPanelComponent, SelectSearchComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule,
    PipesModule,
    FormsModule,
    DirectivesModule,
    EyeCheckboxComponent,
  ],
  exports: [GeneFiltersPanelComponent],
})
export class GeneFiltersPanelModule {}
