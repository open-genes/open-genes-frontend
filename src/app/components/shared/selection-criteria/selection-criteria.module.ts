import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelectionCriteriaComponent } from "./selection-criteria.component";
import { TranslateModule } from '@ngx-translate/core';
import { AccordionComponent } from '../../ui-components/accordion/accordion.component';

@NgModule({
  declarations: [SelectionCriteriaComponent],
  imports: [CommonModule, TranslateModule, AccordionComponent],
  exports: [SelectionCriteriaComponent],
})
export class SelectionCriteriaModule {}
