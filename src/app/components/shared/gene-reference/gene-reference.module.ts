import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneReferenceComponent } from './gene-reference.component';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../modules/third-party/material.module';
import { SkeletonLoaderComponent } from '../../ui-components/skeleton/skeleton.component';
import { NewsListComponent } from '../news-list/news-list.component';

@NgModule({
  declarations: [GeneReferenceComponent],
  imports: [CommonModule, TranslateModule, MaterialModule, SkeletonLoaderComponent, NewsListComponent],
  exports: [GeneReferenceComponent],
})
export class GeneReferenceModule {}
