import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadPageComponent } from './download-page.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../core/pipes/pipes.module';
import { IconComponent } from '../../components/ui-components/icon/app-icon.component';
import {SpinnerComponent} from "../../components/ui-components/spinner/spinner.component";
import { NoContentComponent } from '../../components/shared/no-content/no-content.component';

const routes: Routes = [{ path: '', component: DownloadPageComponent }];

@NgModule({
  declarations: [DownloadPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    PipesModule,
    IconComponent,
    SpinnerComponent,
    NoContentComponent,
  ],
})
export class DownloadPageModule {}
