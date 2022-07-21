import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProteinClassesComponent } from './protein-classes.component';
import { UiComponentsModule } from '../../ui-components/ui-components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ProteinClassesComponent],
  imports: [CommonModule, UiComponentsModule, TranslateModule],
  exports: [ProteinClassesComponent],
})
export class ProteinClassesModule {}
