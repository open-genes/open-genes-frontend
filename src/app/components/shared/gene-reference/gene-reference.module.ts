import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneReferenceComponent } from './gene-reference.component';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../vendors/material.module';
import { NewsListModule } from '../news-list/news-list.module';
import { UiComponentsModule } from '../../ui-components/ui-components.module';

@NgModule({
  declarations: [GeneReferenceComponent],
  imports: [CommonModule, TranslateModule, MaterialModule, NewsListModule, UiComponentsModule],
  exports: [GeneReferenceComponent],
})
export class GeneReferenceModule {}
