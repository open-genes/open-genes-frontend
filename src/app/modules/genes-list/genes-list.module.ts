import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenesListComponent } from './genes-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SearchModule } from '../search/search.module';
import { PipesModule } from '../pipes/pipes.module';
import { DirectivesModule } from '../../pages/home/directives/directives.module';
// import { GenesListService } from './genes-list.service';
import { LoaderPlaceholderComponent } from '../../components/loader-placeholder/loader-placeholder.component';
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    GenesListComponent,
    SearchComponent,
    LoaderPlaceholderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    SearchModule,
    PipesModule,
    DirectivesModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    // GenesListService
  ],
  exports: [
    GenesListComponent,
    LoaderPlaceholderComponent
  ]
})
export class GenesListModule { }
