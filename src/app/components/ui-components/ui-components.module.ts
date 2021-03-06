import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeBlockComponent } from './components/code-block/code-block.component';
import { IconModule } from './components/icon/app-icon.module';
import { SkeletonLoaderComponent } from './components/skeleton/skeleton.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TagComponent } from './components/tag/tag.component';
import { PipesModule } from '../../modules/pipes/pipes.module';
import { AccordionComponent } from './components/accordion/accordion.component';
import { GeneAgeComponent } from '../shared/gene-age/gene-age.component';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverComponent } from './components/popover/popover.component';
import { HintComponent } from './components/hint/hint.component';

const modules = [
  AccordionComponent,
  CodeBlockComponent,
  SkeletonLoaderComponent,
  SpinnerComponent,
  TagComponent,
  GeneAgeComponent,
  PopoverComponent,
  HintComponent,
];

@NgModule({
  declarations: [...modules],
  exports: [...modules],
  imports: [CommonModule, IconModule, PipesModule, TranslateModule],
})
export class UiComponentsModule {}
