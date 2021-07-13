import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsComponent } from './news.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NewsListModule } from '../../components/shared/news-list/news-list.module';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ArticlesListModule } from '../../components/shared/articles-list/articles-list.module';

const routes: Routes = [{ path: '', component: NewsComponent }];

@NgModule({
  declarations: [NewsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NewsListModule,
    MatButtonModule,
    FormsModule,
    ArticlesListModule,
  ],
})
export class NewsModule {}
