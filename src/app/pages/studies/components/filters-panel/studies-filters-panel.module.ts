import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StudiesDataFiltersPanelComponent } from './studies-filters-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../modules/vendors/material.module';
import { UiComponentsModule } from '../../../../components/ui-components/ui-components.module';
import { PipesModule } from '../../../../modules/pipes/pipes.module';
import { DirectivesModule } from '../../../../directives/directives.module';

@NgModule({
  declarations: [StudiesDataFiltersPanelComponent],
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
  exports: [StudiesDataFiltersPanelComponent],
})
export class StudiesFiltersPanelModule {}
