import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpComponent } from './help.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../modules/vendors/material.module';
import { UiComponentsModule } from '../../components/ui-components/ui-components.module';
import { EntitiesComponent } from './entities/entities.component';
import { HELP_ROUTES } from './help-routing';
import { NgToArrayPipeModule } from 'angular-pipes';
import { SidebarModule } from '../../components/shared/sidebar/sidebar.module';

@NgModule({
  declarations: [HelpComponent, EntitiesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(HELP_ROUTES),
    TranslateModule,
    MaterialModule,
    UiComponentsModule,
    NgToArrayPipeModule,
    SidebarModule,
  ],
})
export class HelpModule {}
