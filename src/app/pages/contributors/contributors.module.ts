import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContributorsComponent } from "./contributors.component";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { PipesModule } from '../../core/pipes/pipes.module';
import { SkeletonLoaderComponent } from '../../components/ui-components/skeleton/skeleton.component';

const routes: Routes = [{ path: "", component: ContributorsComponent }];

@NgModule({
  declarations: [ContributorsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    PipesModule,
    SkeletonLoaderComponent,
  ],
})
export class ContributorsModule {}
