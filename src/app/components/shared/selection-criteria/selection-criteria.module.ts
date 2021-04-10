import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelectionCriteriaComponent } from "./selection-criteria.component";
import { UiComponentsModule } from "../../ui-components/ui-components.module";

@NgModule({
  declarations: [SelectionCriteriaComponent],
  imports: [CommonModule, UiComponentsModule],
  exports: [SelectionCriteriaComponent],
})
export class SelectionCriteriaModule {}
