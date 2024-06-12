import { NgModule } from '@angular/core';
import { ParticipateComponent } from './participate.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../../modules/vendors/material.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '', component: ParticipateComponent
  }
]

@NgModule({
  declarations: [
    ParticipateComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MaterialModule,
    TranslateModule,
  ],
  exports: [
    ParticipateComponent
  ],
})
export class ParticipateModule {
}