import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicationInfoComponent } from './publication-info.component';
import { TranslateModule } from '@ngx-translate/core';
import { UiComponentsModule } from "../../ui-components/ui-components.module";
import { NoContentModule } from '../no-content/no-content.module';
import { IconModule } from '../../ui-components/components/icon/app-icon.module';

@NgModule({
  declarations: [PublicationInfoComponent],
  imports: [CommonModule, TranslateModule, UiComponentsModule, NoContentModule, IconModule],
  exports: [PublicationInfoComponent],
})
export class PublicationInfoModule {}
