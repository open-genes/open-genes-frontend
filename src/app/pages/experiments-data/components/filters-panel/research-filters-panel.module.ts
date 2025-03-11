import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ResearchDataFiltersPanelComponent } from './research-filters-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../modules/third-party/material.module';
import { PipesModule } from '../../../../core/pipes/pipes.module';
import { DirectivesModule } from '../../../../directives/directives.module';

@NgModule({
  declarations: [ResearchDataFiltersPanelComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule,
    PipesModule,
    FormsModule,
    DirectivesModule,
  ],
  exports: [ResearchDataFiltersPanelComponent],
})
export class ResearchFiltersPanelModule {}
