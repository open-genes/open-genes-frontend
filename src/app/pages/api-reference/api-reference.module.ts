import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApiReferenceComponent } from "./api-reference.component";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { PipesModule } from "../../modules/pipes/pipes.module";
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';

const routes: Routes = [{ path: "", component: ApiReferenceComponent }];

@NgModule({
  declarations: [ApiReferenceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    PipesModule,
    UiComponentsModule,
  ],
})
export class ApiReferenceModule {}
