import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorvathClockComponent } from './horvath-clock.component';
import { RouterModule } from '@angular/router';
import { HOME_ROUTES } from './horvath-clock-routing';
import { GenesListModule } from '../../components/shared/genes-list/genes-list.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../modules/pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';
import { MatIconModule } from '@angular/material/icon';
import { NoContentModule } from '../../components/shared/no-content/no-content.module';
import { IconModule } from '../../components/ui-components/components/icon/app-icon.module';
import { GenesMethylationListComponent } from './components/genes-methylation-list/genes-methylation-list.component';
import { MaterialModule } from '../../modules/vendors/material.module';
import { NgCapitalizePipeModule, NgTrimPipeModule } from 'angular-pipes';

@NgModule({
  declarations: [HorvathClockComponent, GenesMethylationListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(HOME_ROUTES),
    GenesListModule,
    TranslateModule,
    PipesModule,
    MatButtonModule,
    UiComponentsModule,
    MatIconModule,
    NoContentModule,
    IconModule,
    MaterialModule,
    NgCapitalizePipeModule,
    NgTrimPipeModule,
  ],
  exports: [PipesModule],
})
export class HorvathClockModule {}
