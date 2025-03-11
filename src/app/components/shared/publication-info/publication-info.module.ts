import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicationInfoComponent } from './publication-info.component';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerComponent } from '../../ui-components/spinner/spinner.component';
import { IconComponent } from '../../ui-components/icon/app-icon.component';
import { NoContentComponent } from '../no-content/no-content.component';

@NgModule({
  declarations: [PublicationInfoComponent],
  imports: [CommonModule, TranslateModule, SpinnerComponent, IconComponent, NoContentComponent],
  exports: [PublicationInfoComponent],
})
export class PublicationInfoModule {}
