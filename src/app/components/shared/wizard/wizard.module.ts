import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardSheetComponent } from './wizard-sheet/wizard-sheet.component';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '../../../directives/directives.module';
import {PipesModule} from "../../../modules/pipes/pipes.module";
import {NoContentModule} from "../no-content/no-content.module";
import { IconModule } from '../../ui-components/components/icon/app-icon.module';

@NgModule({
  declarations: [WizardSheetComponent],
  imports: [CommonModule, TranslateModule, DirectivesModule, PipesModule, NoContentModule, IconModule],
})
export class WizardModule {}
