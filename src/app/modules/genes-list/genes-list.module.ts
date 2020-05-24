import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GenesListComponent} from './genes-list.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SearchComponent} from '../search/search.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {SearchModule} from '../search/search.module';
import {PipesModule} from '../pipes/pipes.module';
import {DirectivesModule} from '../../directives/directives.module';
// import { GenesListService } from './genes-list.service';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {LoaderPlaceholderModule} from '../../components/shared/loader-placeholder/loader-placeholder.module';
import {FavouritesService} from '../../core/services/favourites.service';

@NgModule({
  declarations: [
    GenesListComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    SearchModule,
    PipesModule,
    DirectivesModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LoaderPlaceholderModule
  ],
  providers: [
    FavouritesService
  ],
  exports: [
    GenesListComponent
  ]
})
export class GenesListModule {
}
