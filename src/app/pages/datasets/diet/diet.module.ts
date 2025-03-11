import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DietComponent } from './diet.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../../core/pipes/pipes.module';
import { GenesListModule } from '../../../components/shared/genes-list/genes-list.module';
import { DietTableComponent } from './components/diet-table/diet-table.component';
import { SearchModule } from "../../../components/shared/search/search.module";
import { IconComponent } from '../../../components/ui-components/icon/app-icon.component';
import { SpinnerComponent } from '../../../components/ui-components/spinner/spinner.component';
import {MaterialModule} from "../../../modules/third-party/material.module";
import { NoContentComponent } from '../../../components/shared/no-content/no-content.component';

const HOME_ROUTES: Routes = [{ path: '', component: DietComponent }];

@NgModule({
  declarations: [DietComponent, DietTableComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(HOME_ROUTES),
    TranslateModule,
    PipesModule,
    GenesListModule,
    SearchModule,
    IconComponent,
    SpinnerComponent,
    MaterialModule,
    NoContentComponent,
  ],
})
export class DietModule {}
