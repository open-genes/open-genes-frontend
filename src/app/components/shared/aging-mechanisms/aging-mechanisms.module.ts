import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgingMechanismsComponent } from './aging-mechanisms.component';
import { UiComponentsModule } from '../../ui-components/ui-components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AgingMechanismsComponent],
  imports: [CommonModule, UiComponentsModule, TranslateModule],
  exports: [AgingMechanismsComponent],
})
export class AgingMechanismsModule {}
