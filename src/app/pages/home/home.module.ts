import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {RouterModule} from '@angular/router';
import {HOME_ROUTES} from './home-routing';
import {GenesListModule} from '../../modules/genes-list/genes-list.module';
import {MiniCardsComponent} from '../../components/mini-cards/mini-cards.component';
import {TranslateModule} from '@ngx-translate/core';
import {NewsComponent} from '../../components/news/news.component';
import {NgStripTagsPipeModule} from 'angular-pipes';
import {PipesModule} from '../../modules/pipes/pipes.module';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    HomeComponent,
    MiniCardsComponent,
    NewsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(HOME_ROUTES),
    GenesListModule,
    TranslateModule,
    NgStripTagsPipeModule,
    PipesModule,
    MatButtonModule
  ],
  exports: [
    PipesModule
  ]
})
export class HomeModule {
}
