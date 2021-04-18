import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelectionCriteriaComponent } from "./selection-criteria.component";
import { UiComponentsModule } from "../../ui-components/ui-components.module";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SelectionCriteriaComponent],
  imports: [CommonModule, UiComponentsModule, TranslateModule],
  exports: [SelectionCriteriaComponent],
})
export class SelectionCriteriaModule {}
