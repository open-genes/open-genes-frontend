import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneReferenceComponent } from './gene-reference.component';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../modules/vendors/material.module';

@NgModule({
  declarations: [GeneReferenceComponent],
  imports: [CommonModule, TranslateModule, MaterialModule],
  exports: [GeneReferenceComponent],
})
export class GeneReferenceModule {}
