import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GeneComponent} from './gene.component';
import {RouterModule} from '@angular/router';
import {GENE_ROUTES} from './gene-routing';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [GeneComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(GENE_ROUTES),
    TranslateModule
  ]
})
export class GeneModule {
}
