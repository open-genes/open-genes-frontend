import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SearchComponent} from '../search/search.component';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [TableComponent, SearchComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule
  ],
  exports: [TableComponent]
})
export class TableModule { }
