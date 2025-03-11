import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { HOME_ROUTES } from './home-routing';
import { TranslateModule } from '@ngx-translate/core';
import { SearchModule } from "../../components/shared/search/search.module";
import { IconComponent } from '../../components/ui-components/icon/app-icon.component';
import { SkeletonLoaderComponent } from '../../components/ui-components/skeleton/skeleton.component';


@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, RouterModule.forChild(HOME_ROUTES), TranslateModule, SearchModule, IconComponent, SkeletonLoaderComponent],
})
export class HomeModule {}
