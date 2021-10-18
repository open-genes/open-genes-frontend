import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PipesModule } from '../../modules/pipes/pipes.module';
import { LocalizedDatePipe } from '../../modules/pipes/general/i18n-date.pipe';
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';
import { TimelinePageComponent } from './timeline-page.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: TimelinePageComponent,
  },
];

@NgModule({
  declarations: [TimelinePageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), PipesModule, UiComponentsModule, TranslateModule],
  providers: [LocalizedDatePipe],
})
export class TimelinePageModule {}
