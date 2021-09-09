import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssociatedDiseaseCategoriesComponent } from './associated-disease-categories.component';
import { UiComponentsModule } from '../../ui-components/ui-components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AssociatedDiseaseCategoriesComponent],
  imports: [CommonModule, UiComponentsModule, TranslateModule],
  exports: [AssociatedDiseaseCategoriesComponent],
})
export class AssociatedDiseaseCategoriesModule {}
