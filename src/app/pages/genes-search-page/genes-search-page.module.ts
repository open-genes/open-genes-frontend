import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenesSearchPageComponent } from './genes-search-page.component';
import { RouterModule, Routes } from '@angular/router';
import { GenesListModule } from '../../components/shared/genes-list/genes-list.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgStripTagsPipeModule } from 'angular-pipes';
import { PipesModule } from '../../core/pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';
import { SidebarModule } from '../../components/shared/sidebar/sidebar.module';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GeneFiltersPanelModule } from './components/gene-filters-panel/gene-filters-panel.module';
import { SearchModule } from '../../components/shared/search/search.module';
import { PageSubtitleComponent } from '../../components/ui-components/page-subtitle/page-subtitle.component';
import { SkeletonLoaderComponent } from '../../components/ui-components/skeleton/skeleton.component';
import {IconComponent} from "../../components/ui-components/icon/app-icon.component";
import { CarouselComponent } from '../../components/ui-components/carousel/carousel.component';
import { NoContentComponent } from '../../components/shared/no-content/no-content.component';

const routes: Routes = [{ path: '', component: GenesSearchPageComponent }];

@NgModule({
  declarations: [GenesSearchPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GenesListModule,
    TranslateModule,
    NgStripTagsPipeModule,
    PipesModule,
    MatButtonModule,
    SidebarModule,
    MatIconModule,
    MatProgressBarModule,
    GeneFiltersPanelModule,
    SearchModule,
    PageSubtitleComponent,
    SkeletonLoaderComponent,
    IconComponent,
    CarouselComponent,
    NoContentComponent,
  ],
  exports: [PipesModule],
})
export class GenesSearchPageModule {}
