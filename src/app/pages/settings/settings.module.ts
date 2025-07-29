import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from '../../components/shared/sidebar/sidebar.module';
import { RouterModule, Routes } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwitchComponent } from '../../components/ui-components/switch/switch.component';
import {MaterialModule} from "../../modules/third-party/material.module";
import { NgKeysPipeModule } from 'angular-pipes';

const settingsRoutes: Routes = [{ path: '', component: SettingsComponent }];

@NgModule({
  declarations: [SettingsComponent, SwitchComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(settingsRoutes),
    FormsModule,
    TranslateModule,
    SidebarModule,
    MatCheckboxModule,
    MaterialModule,
    ReactiveFormsModule,
    NgKeysPipeModule,
  ],
})
export class SettingsModule {}
