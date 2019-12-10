import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SearchComponent} from '../search/search.component';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {SearchModule} from '../search/search.module';
import {PipesModule} from "../../modules/home/pipes/pipes.module";

@NgModule({
  declarations: [TableComponent, SearchComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    SearchModule,
    PipesModule
  ],
  exports: [TableComponent]
})
export class TableModule { }
