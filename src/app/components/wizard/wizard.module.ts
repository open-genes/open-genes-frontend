import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardSheetComponent } from './wizard-sheet/wizard-sheet.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
  declarations: [WizardSheetComponent],
  imports: [CommonModule, TranslateModule, MatStepperModule],
})
export class WizardModule {}
