import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PipesModule } from '../../core/pipes/pipes.module';
import { LocalizedDatePipe } from '../../core/pipes/general/i18n-date.pipe';
import { TimelinePageComponent } from './timeline-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../modules/third-party/material.module';
import { SpinnerComponent } from '../../components/ui-components/spinner/spinner.component';

const routes: Routes = [
  {
    path: '',
    component: TimelinePageComponent,
  },
];

@NgModule({
  declarations: [TimelinePageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), PipesModule, TranslateModule, MaterialModule, SpinnerComponent],
  providers: [LocalizedDatePipe],
})
export class TimelinePageModule {}
