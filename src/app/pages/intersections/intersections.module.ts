import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntersectionPageComponent } from './intersections.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../modules/pipes/pipes.module';
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';
import { ChartModule } from '../../components/shared/chart/chart.module';

const routes: Routes = [{ path: '', component: IntersectionPageComponent }];

@NgModule({
  declarations: [IntersectionPageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, PipesModule, UiComponentsModule, ChartModule],
})
export class IntersectionsPageModule {}
