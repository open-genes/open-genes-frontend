import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadComponent } from './download.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../modules/pipes/pipes.module';
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';

const routes: Routes = [{ path: '', component: DownloadComponent }];

@NgModule({
  declarations: [DownloadComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, PipesModule, UiComponentsModule],
})
export class DownloadModule {}
