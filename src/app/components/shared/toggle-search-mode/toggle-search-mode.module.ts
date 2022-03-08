import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleSearchModeComponent } from './toggle-search-mode.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../modules/vendors/material.module';

@NgModule({
  declarations: [ToggleSearchModeComponent],
  imports: [CommonModule, TranslateModule, RouterModule, MaterialModule],
  exports: [ToggleSearchModeComponent],
})
export class ToggleSearchModeModule {}
