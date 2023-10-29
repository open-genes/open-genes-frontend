import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeBlockComponent } from './components/code-block/code-block.component';
import { IconModule } from './components/icon/app-icon.module';
import { SkeletonLoaderComponent } from './components/skeleton/skeleton.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TagComponent } from './components/tag/tag.component';
import { PipesModule } from '../../core/pipes/pipes.module';
import { AccordionComponent } from './components/accordion/accordion.component';
import { GeneAgeComponent } from '../shared/gene-age/gene-age.component';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverComponent } from './components/popover/popover.component';
import { HintComponent } from './components/hint/hint.component';
import { MaterialModule } from '../../vendors/material.module'; // TODO: exclude
import { CommonModalComponent } from './components/modals/common-modal/common-modal.component';
import { ArticleModalComponent } from './components/modals/article-modal/article-modal.component';
import { ConfirmModalComponent } from './components/modals/confirm-modal/confirm-modal.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { RouterModule } from '@angular/router';
import { SwitchComponent } from './components/switch/switch.component';
import { EyeCheckboxComponent } from './components/eye-checkbox/eye-checkbox.component';
import { CommonBottomSheetComponent } from './components/modals/common-bottom-sheet/common-bottom-sheet.component';
import { InfoButtonComponent } from './components/info-button/info-button.component';
import { BannerComponent } from './components/banner/banner.component';
import { BurgerMenuComponent } from './components/burger-menu/burger-menu.component';
import { LanguageComponent } from './components/language/language.component';

const modules = [
  AccordionComponent,
  ArticleModalComponent,
  CodeBlockComponent,
  SkeletonLoaderComponent,
  SpinnerComponent,
  TagComponent,
  GeneAgeComponent,
  PopoverComponent,
  HintComponent,
  CommonModalComponent,
  ConfirmModalComponent,
  BreadcrumbsComponent,
  SwitchComponent,
  EyeCheckboxComponent,
  CommonBottomSheetComponent,
  InfoButtonComponent,
  BannerComponent,
  BurgerMenuComponent,
  LanguageComponent,
];

@NgModule({
  declarations: [...modules],
  exports: [...modules],
  imports: [CommonModule, IconModule, PipesModule, TranslateModule, MaterialModule, RouterModule],
})
export class UiComponentsModule {}
