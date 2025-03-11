import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavouritesComponent } from './favourites.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../core/pipes/pipes.module';
import { NgCapitalizePipeModule, NgToArrayPipeModule } from 'angular-pipes';
import { FavouritesListComponent } from './favourites-list/favourites-list.component';
import { SpinnerComponent } from '../../components/ui-components/spinner/spinner.component';
import { IconComponent } from '../../components/ui-components/icon/app-icon.component';
import { MaterialModule } from '../../modules/third-party/material.module';
import { PopoverComponent } from '../../components/ui-components/popover/popover.component';
import { NoContentComponent } from '../../components/shared/no-content/no-content.component';

const routes: Routes = [{ path: '', component: FavouritesComponent }];

@NgModule({
  declarations: [FavouritesComponent, FavouritesListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    PipesModule,
    NgToArrayPipeModule,
    NgCapitalizePipeModule,
    SpinnerComponent,
    IconComponent,
    MaterialModule,
    PopoverComponent,
    NoContentComponent,
  ],
  providers: [],
})
export class FavouritesModule {}
