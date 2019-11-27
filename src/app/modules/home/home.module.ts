import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {RouterModule} from '@angular/router';
import {HOME_ROUTES} from './home-routing';
import {TableModule} from '../../shared';
import {MiniCardsComponent} from '../../shared/mini-cards/mini-cards.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    HomeComponent,
    MiniCardsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(HOME_ROUTES),
    TableModule,
    TranslateModule
  ]
})
export class HomeModule {
}
