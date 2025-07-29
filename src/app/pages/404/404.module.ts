import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404Component } from './404.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {IconComponent} from "../../components/ui-components/icon/app-icon.component";
import { NoContentComponent } from '../../components/shared/no-content/no-content.component';

const routes: Routes = [{ path: '', component: Error404Component }];

@NgModule({
  declarations: [Error404Component],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, IconComponent, NoContentComponent],
})
export class Error404Module {}
