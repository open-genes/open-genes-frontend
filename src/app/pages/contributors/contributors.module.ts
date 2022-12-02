import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContributorsComponent } from "./contributors.component";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { MaterialModule } from "../../modules/vendors/material.module";
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';
import { PipesModule } from '../../modules/pipes/pipes.module';

const routes: Routes = [{ path: "", component: ContributorsComponent }];

@NgModule({
  declarations: [ContributorsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MaterialModule,
    UiComponentsModule,
    PipesModule
  ],
})
export class ContributorsModule {}
