import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavouritesComponent } from './favourites.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../modules/pipes/pipes.module';
import { MaterialModule } from '../../modules/vendors/material.module';
import { NgCapitalizePipeModule, NgToArrayPipeModule } from 'angular-pipes';
import { FavouritesListComponent } from './favourites-list/favourites-list.component';
import { FavouritesService } from '../../core/services/favourites.service';

const routes: Routes = [{ path: '', component: FavouritesComponent }];

@NgModule({
  declarations: [FavouritesComponent, FavouritesListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    PipesModule,
    MaterialModule,
    NgToArrayPipeModule,
    NgCapitalizePipeModule,
  ],
  providers: [FavouritesService],
})
export class FavouritesModule {}
