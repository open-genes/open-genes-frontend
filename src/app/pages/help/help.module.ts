import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HelpComponent} from './help.component';
import {RouterModule, Routes} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {VendorsModule} from '../../modules/vendors/vendors.module';

const routes: Routes = [
  {path: '', component: HelpComponent}
];

@NgModule({
  declarations: [HelpComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    VendorsModule,
  ]
})
export class HelpModule {
}
