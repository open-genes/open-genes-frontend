import { NgModule } from '@angular/core';

import { SafePipe } from './general/safe.pipe';
import { StripTagsPipe } from './general/strip-tags.pipe';
import { SplitByPipe } from './general/split-by.pipe';
import { LocalizedDatePipe } from './general/i18n-date.pipe';
import { UnixTimeFormatterPipe } from './general/unix-time-formatter.pipe';
import { ReplacePipe } from './general/replace.pipe';
import { ZeroPaddingPipe } from './specific/zero-padding.pipe';
import { PublicationLinksPipe } from './specific/publication-links.pipe';
import { getResearchStatsById } from './specific/getResearchStatsById.pipe';
import { AnchorLinksPipe } from './specific/anchor-links.pipe';

const GENERAL_PIPES = [
  SafePipe,
  StripTagsPipe,
  SplitByPipe,
  LocalizedDatePipe,
  UnixTimeFormatterPipe,
  ReplacePipe,
];

const SPECIFIC_PIPES = [
  ZeroPaddingPipe,
  PublicationLinksPipe,
  AnchorLinksPipe,
  getResearchStatsById,
];

const PIPES = [...GENERAL_PIPES, ...SPECIFIC_PIPES];

@NgModule({
  declarations: [...PIPES],
  exports: [...PIPES],
})
export class PipesModule {}
