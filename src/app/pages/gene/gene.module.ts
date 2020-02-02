import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GeneComponent} from './gene.component';
import {RouterModule} from '@angular/router';
import {GENE_ROUTES} from './gene-routing';
import {TranslateModule} from '@ngx-translate/core';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatExpansionModule} from "@angular/material/expansion";


@NgModule({
  declarations: [GeneComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(GENE_ROUTES),
    TranslateModule,
    MatProgressBarModule,
    MatCardModule,
    MatListModule,
    MatExpansionModule
  ]
})
export class GeneModule {
}
