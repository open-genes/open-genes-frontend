import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../../modules/pipes/pipes.module';
import { SearchComponent } from './search.component';
import { SearchCounterComponent } from './search-counter/search-counter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../modules/vendors/material.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SearchComponent, SearchCounterComponent],
  imports: [
    CommonModule,
    PipesModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialModule,
    DirectivesModule,
    RouterModule,
  ],
  exports: [SearchComponent, SearchCounterComponent],
})
export class SearchModule {}
