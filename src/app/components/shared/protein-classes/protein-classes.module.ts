import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProteinClassesComponent } from './protein-classes.component';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionComponent } from '../../ui-components/accordion/accordion.component';

@NgModule({
  declarations: [ProteinClassesComponent],
  imports: [CommonModule, TranslateModule, AccordionComponent],
  exports: [ProteinClassesComponent],
})
export class ProteinClassesModule {}
