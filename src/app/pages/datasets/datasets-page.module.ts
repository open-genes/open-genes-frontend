import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DATASETS_PAGE_ROUTES } from './datasets-page-routing';
import { DatasetsPageComponent } from './datasets-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { UiComponentsModule } from "../../components/ui-components/ui-components.module";
import { MaterialModule } from '../../vendors/material.module';

@NgModule({
  declarations: [DatasetsPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DATASETS_PAGE_ROUTES),
    MaterialModule,
    TranslateModule,
    UiComponentsModule
  ],
  exports: [],
})
export class DatasetsPageModule {}
