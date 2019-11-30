import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiComponent} from './api.component';
import {RouterModule, Routes} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
  {path: '', component: ApiComponent}
];

@NgModule({
  declarations: [ApiComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule
  ]
})
export class ApiModule {
}
