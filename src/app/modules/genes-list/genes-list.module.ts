import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenesListComponent } from './genes-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SearchModule } from '../search/search.module';
import { PipesModule } from '../../pages/home/pipes/pipes.module';
import { DirectivesModule } from '../../pages/home/directives/directives.module';
// import { GenesListService } from './genes-list.service';
import { LoaderPlaceholderComponent } from '../../components/loader-placeholder/loader-placeholder.component';

@NgModule({
  declarations: [
    GenesListComponent,
    SearchComponent,
    LoaderPlaceholderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    SearchModule,
    PipesModule,
    DirectivesModule
  ],
  providers: [
    // GenesListService
  ],
  exports: [
    GenesListComponent,
    LoaderPlaceholderComponent
  ]
})
export class GenesListModule { }
