import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermHintComponent } from './term-hint.component';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '../../../directives/directives.module';
import { MAT_BOTTOM_SHEET_DEFAULT_OPTIONS } from '@angular/material/bottom-sheet';
import { NgCapitalizePipeModule } from 'angular-pipes';

@NgModule({
  declarations: [TermHintComponent],
  imports: [
    CommonModule,
    TranslateModule,
    DirectivesModule,
    NgCapitalizePipeModule,
  ],
  providers: [
    {
      provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: false,
      },
    },
  ],
})
export class TermHintModule {}
