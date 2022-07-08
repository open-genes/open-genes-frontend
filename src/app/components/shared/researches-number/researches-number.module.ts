import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchesNumberComponent } from './researches-number.component';
import { SetClassNamePipe } from './set-class-name.pipe';

@NgModule({
  declarations: [ResearchesNumberComponent, SetClassNamePipe],
  imports: [CommonModule],
  exports: [ResearchesNumberComponent],
})
export class ResearchNumberModule {}
