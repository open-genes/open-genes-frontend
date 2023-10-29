import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { SearchCounterComponent } from './search-counter/search-counter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../../../core/pipes/pipes.module';
import { MaterialModule } from '../../../vendors/material.module';
import { DirectivesModule } from '../../../core/directives/directives.module';

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
