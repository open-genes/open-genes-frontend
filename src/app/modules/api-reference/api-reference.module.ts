import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiComponent} from './api.component';
import {RouterModule, Routes} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {CodeComponent} from '../../common/code/code.component';
import {PipesModule} from "../home/pipes/pipes.module";

const routes: Routes = [
  {path: '', component: ApiComponent}
];

@NgModule({
  declarations: [ApiComponent, CodeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    PipesModule
  ]
})
export class ApiModule {
}
