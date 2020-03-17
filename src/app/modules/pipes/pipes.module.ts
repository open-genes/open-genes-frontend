import { NgModule } from '@angular/core';

import { SafePipe } from './safe.pipe';
import { StripTagsPipe } from './strip-tags.pipe';
import {SplitByPipe} from './split-by.pipe';

const PIPES = [
  SafePipe,
  StripTagsPipe,
  SplitByPipe
];

@NgModule({
  declarations: [
    ...PIPES
  ],
  exports: [
    ...PIPES
  ]
})

export class PipesModule {
}
