import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicationInfoComponent } from './publication-info.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PublicationInfoComponent],
  imports: [CommonModule, TranslateModule],
  exports: [PublicationInfoComponent],
})
export class PublicationInfoModule {}
