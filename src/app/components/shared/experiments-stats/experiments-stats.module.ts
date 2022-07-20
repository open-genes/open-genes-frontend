import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperimentsStatsComponent } from './experiments-stats.component';
import { SetClassNamePipe } from './set-class-name.pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ExperimentsStatsComponent, SetClassNamePipe],
  imports: [CommonModule, TranslateModule],
  exports: [ExperimentsStatsComponent],
})
export class ExperimentsStatsModule {}
