import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesListComponent } from './articles-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { UiComponentsModule } from '../../ui-components/ui-components.module';
import { RouterModule } from '@angular/router';
import { NgTruncatePipeModule } from 'angular-pipes';
import { NoContentModule } from '../no-content/no-content.module';
import { IconModule } from '../../ui-components/components/icon/app-icon.module';
import { PipesModule } from '../../../core/pipes/pipes.module';
import { MaterialModule } from '../../../vendors/material.module';

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
    NoContentModule,
    IconModule,
  ],
  exports: [ArticlesListComponent],
})
export class ArticlesListModule {}
