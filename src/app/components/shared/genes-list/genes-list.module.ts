import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GenesListComponent} from './genes-list.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SearchComponent} from '../search/search.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {SearchModule} from '../search/search.module';
import {PipesModule} from '../../../modules/pipes/pipes.module';
import {DirectivesModule} from '../../../directives/directives.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {LoaderPlaceholderModule} from '../loader-placeholder/loader-placeholder.module';
import {FavouritesService} from '../../../core/services/favourites.service';
import {MatCardModule} from '@angular/material/card';
import {WindowService} from '../../../core/services/browser/window.service';
import {GeneMenuComponent} from './components/gene-menu.component';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    GenesListComponent,
    SearchComponent,
    GeneMenuComponent,
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
    LoaderPlaceholderModule,
    MatCardModule,
    MatTooltipModule
  ],
  providers: [
    FavouritesService,
    WindowService,
  ],
  exports: [
    GenesListComponent,
    SearchComponent,
  ]
})
export class GenesListModule {
}
