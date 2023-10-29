import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PipesModule } from '../../core/pipes/pipes.module';
import { LocalizedDatePipe } from '../../core/pipes/general/i18n-date.pipe';
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';
import { TimelinePageComponent } from './timeline-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from "../../vendors/material.module";

const routes: Routes = [
  {
    path: '',
    component: TimelinePageComponent,
  },
];

@NgModule({
  declarations: [TimelinePageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), PipesModule, UiComponentsModule, TranslateModule, MaterialModule],
  providers: [LocalizedDatePipe],
})
export class TimelinePageModule {}
