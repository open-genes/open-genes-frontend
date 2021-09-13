import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404Component } from './404.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NoContentModule } from '../../components/shared/no-content/no-content.module';

const routes: Routes = [{ path: '', component: Error404Component }];

@NgModule({
  declarations: [Error404Component],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, NoContentModule],
})
export class Error404Module {}
