import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HelpComponent } from "./help.component";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { MaterialModule } from "../../modules/vendors/material.module";

const routes: Routes = [{ path: "", component: HelpComponent }];

@NgModule({
  declarations: [HelpComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MaterialModule,
  ],
})
export class HelpModule {}
