import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsListComponent } from './news-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../../modules/pipes/pipes.module';
import { UiComponentsModule } from '../../ui-components/ui-components.module';
import { RouterModule } from '@angular/router';
import { NoContentModule } from '../no-content/no-content.module';

@NgModule({
  declarations: [NewsListComponent],
  imports: [CommonModule, TranslateModule, PipesModule, UiComponentsModule, RouterModule, NoContentModule],
  exports: [NewsListComponent],
})
export class NewsListModule {}
