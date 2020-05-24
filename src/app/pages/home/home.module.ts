import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {RouterModule} from '@angular/router';
import {HOME_ROUTES} from './home-routing';
import {GenesListModule} from '../../modules/genes-list/genes-list.module';
import {MiniCardsComponent} from '../../components/mini-cards/mini-cards.component';
import {TranslateModule} from '@ngx-translate/core';
import {NgStripTagsPipeModule} from 'angular-pipes';
import {PipesModule} from '../../modules/pipes/pipes.module';
import {MatButtonModule} from '@angular/material/button';
import {NewsListModule} from '../../components/shared/news-list/news-list.module';

@NgModule({
  declarations: [
    HomeComponent,
    MiniCardsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(HOME_ROUTES),
    GenesListModule,
    TranslateModule,
    NgStripTagsPipeModule,
    PipesModule,
    MatButtonModule,
    NewsListModule,
  ],
  exports: [
    PipesModule
  ]
})
export class HomeModule {
}
