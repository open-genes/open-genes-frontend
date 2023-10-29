import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadComponent } from './download.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';
import { NoContentModule } from '../../components/shared/no-content/no-content.module';
import { IconModule } from '../../components/ui-components/components/icon/app-icon.module';
import { PipesModule } from '../../core/pipes/pipes.module';

const routes: Routes = [{ path: '', component: DownloadComponent }];

@NgModule({
  declarations: [DownloadComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    PipesModule,
    UiComponentsModule,
    NoContentModule,
    IconModule,
  ],
})
export class DownloadModule {}
