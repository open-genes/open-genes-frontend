import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../modules/vendors/material.module';
import { GeneFieldsModalComponent } from './gene-fields-modal.component';
import { UiComponentsModule } from '../../ui-components/ui-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../../modules/pipes/pipes.module';
import { DirectivesModule } from "../../../directives/directives.module";

@NgModule({
  declarations: [GeneFieldsModalComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialModule,
    UiComponentsModule,
    ReactiveFormsModule,
    TranslateModule,
    PipesModule,
    FormsModule,
    DirectivesModule
  ],
  exports: [GeneFieldsModalComponent],
})
export class GeneFieldsModalModule {}
