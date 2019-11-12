import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TableComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [TableComponent]
})
export class TableModule { }
