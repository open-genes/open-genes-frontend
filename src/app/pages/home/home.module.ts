import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { HOME_ROUTES } from './home-routing';
import { GenesListModule } from '../../components/shared/genes-list/genes-list.module';
import { MiniCardsComponent } from '../../components/mini-cards/mini-cards.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgStripTagsPipeModule } from 'angular-pipes';
import { PipesModule } from '../../modules/pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';
import { NewsListModule } from '../../components/shared/news-list/news-list.module';
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';
import { ArticlesListModule } from '../../components/shared/articles-list/articles-list.module';
import { SidebarModule } from '../../components/shared/sidebar/sidebar.module';
import { WizardSheetComponent } from '../../components/wizard-sheet/wizard-sheet.component';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
  declarations: [HomeComponent, MiniCardsComponent, WizardSheetComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(HOME_ROUTES),
    GenesListModule,
    TranslateModule,
    NgStripTagsPipeModule,
    PipesModule,
    MatButtonModule,
    NewsListModule,
    UiComponentsModule,
    ArticlesListModule,
    SidebarModule,
    MatStepperModule,
  ],
  exports: [PipesModule],
})
export class HomeModule {}
