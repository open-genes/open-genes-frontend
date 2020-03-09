import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GeneComponent} from './gene.component';
import {RouterModule} from '@angular/router';
import {GENE_ROUTES} from './gene-routing';
import {TranslateModule} from '@ngx-translate/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {PipesModule} from '../../modules/pipes/pipes.module';
import {VendorsModule} from '../../modules/vendors/vendors.module';

@NgModule({
  declarations: [
    GeneComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(GENE_ROUTES),
    TranslateModule,
    MatProgressBarModule,
    MatCardModule,
    MatListModule,
    MatExpansionModule,
    PipesModule,
    VendorsModule
  ]
})
export class GeneModule {
}
