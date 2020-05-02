import { NgModule } from '@angular/core';

import { SafePipe } from './safe.pipe';
import { StripTagsPipe } from './strip-tags.pipe';
import {SplitByPipe} from './split-by.pipe';
import {ZeroPadding} from './zero-padding.pipe';
import {LocalizedDatePipe} from './i18n-date.pipe';

const PIPES = [
  SafePipe,
  StripTagsPipe,
  SplitByPipe,
  ZeroPadding,
  LocalizedDatePipe
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
