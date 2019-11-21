import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [TableComponent],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [TableComponent]
})
export class TableModule { }
