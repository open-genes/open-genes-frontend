import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { HOME_ROUTES } from './home-routing';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../modules/vendors/material.module';
import {SearchModule} from "../../components/shared/search/search.module";

@NgModule({
  declarations: [HomeComponent],
    imports: [CommonModule, RouterModule.forChild(HOME_ROUTES), TranslateModule, MaterialModule, SearchModule],
})
export class HomeModule {}
