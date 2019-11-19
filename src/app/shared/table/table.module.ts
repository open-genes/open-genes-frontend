import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SearchComponent} from '../search/search.component';

@NgModule({
  declarations: [TableComponent, SearchComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [TableComponent]
})
export class TableModule { }
