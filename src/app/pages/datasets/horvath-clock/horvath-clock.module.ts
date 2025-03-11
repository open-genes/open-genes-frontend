import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorvathClockComponent } from './horvath-clock.component';
import { RouterModule } from '@angular/router';
import { HOME_ROUTES } from './horvath-clock-routing';
import { GenesListModule } from '../../../components/shared/genes-list/genes-list.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../../core/pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GenesMethylationListComponent } from './components/genes-methylation-list/genes-methylation-list.component';
import { NgCapitalizePipeModule, NgTrimPipeModule } from 'angular-pipes';
import { SearchModule } from '../../../components/shared/search/search.module';
import { MaterialModule } from '../../../modules/third-party/material.module';
import { SpinnerComponent } from '../../../components/ui-components/spinner/spinner.component';
import { IconComponent } from '../../../components/ui-components/icon/app-icon.component';
import { NoContentComponent } from '../../../components/shared/no-content/no-content.component';

@NgModule({
  declarations: [HorvathClockComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(HOME_ROUTES),
    GenesListModule,
    TranslateModule,
    PipesModule,
    MatButtonModule,
    MatIconModule,
    MaterialModule,
    NgCapitalizePipeModule,
    NgTrimPipeModule,
    SearchModule,
    MaterialModule,
    GenesMethylationListComponent,
    SpinnerComponent,
    IconComponent,
    NoContentComponent,
  ],
  exports: [PipesModule],
})
export class HorvathClockModule {}
