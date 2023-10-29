import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavouritesComponent } from './favourites.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgCapitalizePipeModule, NgToArrayPipeModule } from 'angular-pipes';
import { FavouritesListComponent } from './favourites-list/favourites-list.component';
import { NoContentModule } from '../../components/shared/no-content/no-content.module';
import { IconModule } from '../../components/ui-components/components/icon/app-icon.module';
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';
import { PipesModule } from '../../core/pipes/pipes.module';
import { MaterialModule } from '../../vendors/material.module';

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
    NoContentModule,
    IconModule,
    UiComponentsModule,
  ],
  providers: [],
})
export class FavouritesModule {}
