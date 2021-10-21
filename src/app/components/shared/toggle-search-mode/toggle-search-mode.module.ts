import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleSearchModeComponent } from './toggle-search-mode.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ToggleSearchModeComponent],
  imports: [CommonModule, TranslateModule],
  exports: [ToggleSearchModeComponent],
})
export class ToggleSearchModeModule {}
