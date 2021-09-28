import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoContentComponent } from './no-content.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [NoContentComponent],
  imports: [CommonModule, TranslateModule],
  exports: [NoContentComponent],
})
export class NoContentModule {}
