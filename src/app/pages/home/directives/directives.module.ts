import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightDirective } from './highlight.directive';

const DIRECTIVES = [
  HighlightDirective
];

@NgModule({
  declarations: [
    ...DIRECTIVES
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ...DIRECTIVES
  ]
})
export class DirectivesModule { }
