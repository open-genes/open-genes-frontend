import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../modules/vendors/material.module';
import { GeneFieldsModalComponent } from './gene-fields-modal.component';
import { UiComponentsModule } from '../../ui-components/ui-components.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [GeneFieldsModalComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialModule,
    UiComponentsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [GeneFieldsModalComponent],
})
export class GeneFieldsModalModule {}
