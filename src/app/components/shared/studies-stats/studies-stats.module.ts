import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudiesStatsComponent } from './studies-stats.component';
import { SetClassNamePipe } from './set-class-name.pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [StudiesStatsComponent, SetClassNamePipe],
  imports: [CommonModule, TranslateModule],
  exports: [StudiesStatsComponent],
})
export class StudiesStatsModule {}
