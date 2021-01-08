import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FavouritesComponent } from "./favourites.component";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { PipesModule } from "../../modules/pipes/pipes.module";
import { VendorsModule } from "../../modules/vendors/vendors.module";
import { NgCapitalizePipeModule, NgToArrayPipeModule } from "angular-pipes";

const routes: Routes = [{ path: "", component: FavouritesComponent }];

@NgModule({
  declarations: [FavouritesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    PipesModule,
    VendorsModule,
    NgToArrayPipeModule,
    NgCapitalizePipeModule,
  ],
})
export class FavouritesModule {}
