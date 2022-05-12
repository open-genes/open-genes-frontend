import { NgModule } from '@angular/core';

import { SafePipe } from './general/safe.pipe';
import { StripTagsPipe } from './general/strip-tags.pipe';
import { SplitByPipe } from './general/split-by.pipe';
import { LocalizedDatePipe } from './general/i18n-date.pipe';
import { UnixTimeFormatterPipe } from './general/unix-time-formatter.pipe';
import { ReplacePipe } from './general/replace.pipe';
import { ZeroPaddingPipe } from './specific/zero-padding.pipe';
import { PublicationLinksWrapperPipe } from './specific/publication-links-wrapper.pipe';
import { getResearchStatsById } from './specific/getResearchStatsById.pipe';
import { AnchorLinksPipe } from './specific/anchor-links.pipe';
import { OrthologLinkWrapperPipe } from './specific/ortholog-links.pipe';
import { TrueFalseNullPipe } from './specific/true-false-null';
import { SearchFilterPipe } from './general/search-filter.pipe';
import { CheckBlankValuePipe } from './general/check-blank-value';

const GENERAL_PIPES = [
  SafePipe,
  StripTagsPipe,
  SplitByPipe,
  LocalizedDatePipe,
  UnixTimeFormatterPipe,
  ReplacePipe,
  SearchFilterPipe,
  CheckBlankValuePipe,
];

const SPECIFIC_PIPES = [
  ZeroPaddingPipe,
  PublicationLinksWrapperPipe,
  AnchorLinksPipe,
  OrthologLinkWrapperPipe,
  getResearchStatsById,
  TrueFalseNullPipe,
];

const PIPES = [...GENERAL_PIPES, ...SPECIFIC_PIPES];

@NgModule({
  declarations: [...PIPES],
  exports: [...PIPES],
})
export class PipesModule {}
