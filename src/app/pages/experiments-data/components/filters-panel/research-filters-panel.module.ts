import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ResearchDataFiltersPanelComponent } from './research-filters-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../vendors/material.module';
import { UiComponentsModule } from '../../../../components/ui-components/ui-components.module';
import { PipesModule } from '../../../../core/pipes/pipes.module';
import { DirectivesModule } from '../../../../core/directives/directives.module';

@NgModule({
  declarations: [ResearchDataFiltersPanelComponent],
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
  exports: [ResearchDataFiltersPanelComponent],
})
export class ResearchFiltersPanelModule {}
