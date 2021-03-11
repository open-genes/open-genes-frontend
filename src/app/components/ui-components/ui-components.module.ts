import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeBlockComponent } from './components/code-block/code-block.component';
import { IconModule } from './components/icon/app-icon.module';
import { SkeletonLoaderComponent } from './components/skeleton/skeleton.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TagComponent } from './components/tag/tag.component';
import { PipesModule } from '../../modules/pipes/pipes.module';

@NgModule({
  declarations: [
    CodeBlockComponent,
    SkeletonLoaderComponent,
    SpinnerComponent,
    TagComponent
  ],
  exports: [
    CodeBlockComponent,
    SpinnerComponent,
    SkeletonLoaderComponent,
    TagComponent
  ],
  imports: [
    CommonModule,
    IconModule,
    PipesModule
  ]
})
export class UiComponentsModule { }
