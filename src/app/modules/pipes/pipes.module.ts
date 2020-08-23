import { NgModule } from '@angular/core';

import { SafePipe } from './safe.pipe';
import { StripTagsPipe } from './strip-tags.pipe';
import { SplitByPipe } from './split-by.pipe';
import { ZeroPadding } from './zero-padding.pipe';
import { LocalizedDatePipe } from './i18n-date.pipe';
import { unixTimeFormatterPipe } from './unix-time-formatter.pipe';
import {ReplacePipe} from './replace.pipe';
import {LinkifyPipe} from './linkify.pipe';

const PIPES = [
  SafePipe,
  StripTagsPipe,
  SplitByPipe,
  ZeroPadding,
  LocalizedDatePipe,
  unixTimeFormatterPipe,
  ReplacePipe,
  LinkifyPipe
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
