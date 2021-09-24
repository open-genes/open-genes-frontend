import { NgModule } from '@angular/core';
import { TimelimePageComponent } from './timelime-page.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PipesModule } from '../../modules/pipes/pipes.module';
import { LocalizedDatePipe } from '../../modules/pipes/general/i18n-date.pipe';
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';

const routes: Routes = [
  {
    path: '',
    component: TimelimePageComponent
  }
]

@NgModule({
  declarations: [
    TimelimePageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PipesModule,
    UiComponentsModule
  ],
  providers: [
    LocalizedDatePipe,
  ]
})

export class TimelimePageModule {

}