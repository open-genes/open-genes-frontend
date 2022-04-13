import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncreaseLifespanComponent } from './increase-lifespan.component';
import { RouterModule } from '@angular/router';
import { RESEARCHES_ROUTES } from './increase-lifespan-routing';
import { GenesListModule } from '../../components/shared/genes-list/genes-list.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../modules/pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';
import { MatIconModule } from '@angular/material/icon';
import { NoContentModule } from '../../components/shared/no-content/no-content.module';
import { IconModule } from '../../components/ui-components/components/icon/app-icon.module';
import { MaterialModule } from '../../modules/vendors/material.module';
import { NgCapitalizePipeModule, NgTrimPipeModule } from 'angular-pipes';
import { ResearchTablesModule } from '../../components/shared/research-tables/research-tables.module';
import { ResearchTabComponent } from './components/research-tab/research-tab.component';

@NgModule({
  declarations: [IncreaseLifespanComponent, ResearchTabComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(RESEARCHES_ROUTES),
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
    ResearchTablesModule,
  ],
  exports: [PipesModule],
})
export class IncreaseLifespanModule {}
