import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AssociatedDiseasesComponent } from "./associated-diseases.component";
import { UiComponentsModule } from "../../ui-components/ui-components.module";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AssociatedDiseasesComponent],
  imports: [CommonModule, UiComponentsModule, TranslateModule],
  exports: [AssociatedDiseasesComponent],
})
export class AssociatedDiseasesModule {}
