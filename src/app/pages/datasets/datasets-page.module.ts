import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../modules/vendors/material.module';
import { DATASETS_PAGE_ROUTES } from './datasets-page-routing';
import { DatasetsPageComponent } from './datasets-page.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [DatasetsPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DATASETS_PAGE_ROUTES),
    MaterialModule,
    TranslateModule,
  ],
  exports: [],
})
export class DatasetsPageModule {}
