import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneReferenceComponent } from './gene-reference.component';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../modules/vendors/material.module';
import { NewsListModule } from '../news-list/news-list.module';

@NgModule({
  declarations: [GeneReferenceComponent],
  imports: [CommonModule, TranslateModule, MaterialModule, NewsListModule],
  exports: [GeneReferenceComponent],
})
export class GeneReferenceModule {}
