import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsListComponent } from './news-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../../modules/pipes/pipes.module';
import { UiComponentsModule } from '../../ui-components/ui-components.module';
import { RouterModule } from '@angular/router';
import { NoNewsComponent } from './no-news/no-news.component';

@NgModule({
  declarations: [NewsListComponent, NoNewsComponent],
  imports: [CommonModule, TranslateModule, PipesModule, UiComponentsModule, RouterModule],
  exports: [NewsListComponent],
})
export class NewsListModule {}
