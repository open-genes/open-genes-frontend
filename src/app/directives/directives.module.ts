import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightDirective } from './highlight.directive';
import { SwipeHorizontalDirective } from './swipe-horizontal.directive';
import { SwipeVeticalDirective } from './swipe-vertical.directive';
import { TermInfoDirective } from './term-info.directive';
import { DynamicContentAnchorsDirective } from './anchor-links.directive';

const DIRECTIVES = [
  HighlightDirective,
  SwipeHorizontalDirective,
  SwipeVeticalDirective,
  TermInfoDirective,
  DynamicContentAnchorsDirective,
];

@NgModule({
  declarations: [...DIRECTIVES],
  imports: [CommonModule],
  exports: [...DIRECTIVES],
})
export class DirectivesModule {}
