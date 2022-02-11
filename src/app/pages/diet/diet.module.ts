import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DietComponent } from './diet.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../modules/pipes/pipes.module';
import { IconModule } from '../../components/ui-components/components/icon/app-icon.module';
import { NoContentModule } from '../../components/shared/no-content/no-content.module';
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';
import { GenesListModule } from '../../components/shared/genes-list/genes-list.module';
import { DietTableComponent } from './components/diet-table/diet-table.component';
import { MaterialModule } from '../../modules/vendors/material.module';

const HOME_ROUTES: Routes = [{ path: '', component: DietComponent }];

@NgModule({
  declarations: [DietComponent, DietTableComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(HOME_ROUTES),
    TranslateModule,
    PipesModule,
    IconModule,
    NoContentModule,
    UiComponentsModule,
    GenesListModule,
    MaterialModule
  ],
})
export class DietModule {}
