import { NgModule } from '@angular/core';

import {SafePipe} from './safe.pipe';
import {HighlightSearch} from './highlight.pipe';

const PIPES = [
  SafePipe,
  HighlightSearch
];

@NgModule({
  declarations: [
    ...PIPES,
  ],
  exports: [
    ...PIPES,
  ]
})

export class PipesModule {
}
