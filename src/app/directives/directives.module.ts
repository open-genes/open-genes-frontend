import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightDirective } from './highlight.directive';
import { SwipeHorizontalDirective } from './swipe-horizontal.directive';
import { SwipeVeticalDirective } from './swipe-vertical.directive';
import { TermInfoDirective } from './term-info.directive';
import { MatSearchInputDirective } from './mat-search-input.directive';

const DIRECTIVES = [
  HighlightDirective,
  SwipeHorizontalDirective,
  SwipeVeticalDirective,
  TermInfoDirective,
  MatSearchInputDirective,
];

@NgModule({
  declarations: [...DIRECTIVES],
  imports: [CommonModule],
  exports: [...DIRECTIVES],
})
export class DirectivesModule {}
