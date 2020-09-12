import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GoSearchComponent} from './go-search.component';
import {RouterModule, Routes} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
  {path: '', component: GoSearchComponent}
];

@NgModule({
  declarations: [GoSearchComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule
  ]
})
export class GoSearchModule {
}
