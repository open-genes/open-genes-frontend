import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesListComponent } from './articles-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../../modules/pipes/pipes.module';
import { UiComponentsModule } from '../../ui-components/ui-components.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../modules/vendors/material.module';
import { NgTruncatePipeModule } from 'angular-pipes';

@NgModule({
  declarations: [ArticlesListComponent],
  imports: [
    CommonModule,
    TranslateModule,
    PipesModule,
    UiComponentsModule,
    RouterModule,
    MaterialModule,
    NgTruncatePipeModule,
  ],
  exports: [ArticlesListComponent],
})
export class ArticlesListModule {}
