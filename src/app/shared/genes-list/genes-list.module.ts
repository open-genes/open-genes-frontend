import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SearchModule } from '../search/search.module';
import { PipesModule } from '../../modules/home/pipes/pipes.module';
import { DirectivesModule } from '../../modules/home/directives/directives.module';
import { GenesListService } from './genes-list.service';

@NgModule({
  declarations: [
    TableComponent,
    SearchComponent
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
    // TableService
  ],
  exports: [
    TableComponent
  ]
})
export class TableModule { }
