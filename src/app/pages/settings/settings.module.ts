import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from '../../components/shared/sidebar/sidebar.module';
import { RouterModule, Routes } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';

const settingsRoutes: Routes = [{ path: '', component: SettingsComponent }];

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(settingsRoutes),
    FormsModule,
    TranslateModule,
    SidebarModule,
    MatCheckboxModule,
    UiComponentsModule,
  ],
})
export class SettingsModule {}
