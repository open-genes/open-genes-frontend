import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NewsListComponent} from './news-list.component';
import {TranslateModule} from '@ngx-translate/core';
import {PipesModule} from '../../modules/pipes/pipes.module';
import {LoaderPlaceholderModule} from '../loader-placeholder/loader-placeholder.module';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [NewsListComponent],
  imports: [
    CommonModule,
    TranslateModule,
    PipesModule,
    LoaderPlaceholderModule,
    RouterModule
  ],
  exports: [
    NewsListComponent
  ]
})
export class NewsListModule {
}
