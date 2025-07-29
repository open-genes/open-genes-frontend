import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperimentsDataPageComponent } from './experiments-data-page.component';
import { RouterModule } from '@angular/router';
import { RESEARCHES_ROUTES } from './experiments-data-page-routing';
import { GenesListModule } from '../../components/shared/genes-list/genes-list.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../core/pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgCapitalizePipeModule, NgTrimPipeModule } from 'angular-pipes';
import { ResearchTablesModule } from '../../components/shared/research-tables/research-tables.module';
import { ResearchTabComponent } from './components/research-tab/research-tab.component';
import { ResearchFiltersPanelModule } from './components/filters-panel/research-filters-panel.module';
import { SearchModule } from '../../components/shared/search/search.module';
import { SidebarModule } from '../../components/shared/sidebar/sidebar.module';
import { PageSubtitleComponent } from '../../components/ui-components/page-subtitle/page-subtitle.component';
import { MaterialModule } from '../../modules/third-party/material.module';
import { IconComponent } from '../../components/ui-components/icon/app-icon.component';
import {SpinnerComponent} from "../../components/ui-components/spinner/spinner.component";
import {NoContentComponent} from "../../components/shared/no-content/no-content.component";

@NgModule({
  declarations: [ExperimentsDataPageComponent, ResearchTabComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(RESEARCHES_ROUTES),
        GenesListModule,
        TranslateModule,
        PipesModule,
        MatButtonModule,
        MatIconModule,
        NgCapitalizePipeModule,
        NgTrimPipeModule,
        ResearchTablesModule,
        ResearchFiltersPanelModule,
        SearchModule,
        SidebarModule,
        PageSubtitleComponent,
        MaterialModule,
        IconComponent,
        SpinnerComponent,
        NoContentComponent,
    ],
  exports: [PipesModule],
})
export class ExperimentsDataPageModule {}
