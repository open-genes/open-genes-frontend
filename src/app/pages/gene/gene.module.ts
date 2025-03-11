import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneComponent } from './gene.component';
import { RouterModule } from '@angular/router';
import { GENE_ROUTES } from './gene-routing';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { PipesModule } from '../../core/pipes/pipes.module';
import { NgSplitPipeModule, NgToArrayPipeModule } from 'angular-pipes';
import { ResearchDataComponent } from './research-data/research-data.component';
import { GeneOntologyComponent } from './gene-ontology/gene-ontology.component';
import { HumanProteinAtlasComponent } from './human-protein-atlas/human-protein-atlas.component';
import { ExpressionComponent } from './expression/expression.component';
import { SidebarModule } from '../../components/shared/sidebar/sidebar.module';
import { DirectivesModule } from '../../directives/directives.module';
import { GeneReferenceModule } from '../../components/shared/gene-reference/gene-reference.module';
import { PublicationInfoModule } from '../../components/shared/publication-info/publication-info.module';
import { ResearchTablesModule } from '../../components/shared/research-tables/research-tables.module';
import { GeneLocationComponent } from '../../components/shared/gene-location/gene-location.component';
import { BreadcrumbsComponent } from '../../components/ui-components/breadcrumbs/breadcrumbs.component';
import { SkeletonLoaderComponent } from '../../components/ui-components/skeleton/skeleton.component';
import { TagComponent } from '../../components/ui-components/tag/tag.component';
import { IconComponent } from '../../components/ui-components/icon/app-icon.component';
import { GeneAgeComponent } from '../../components/shared/gene-age/gene-age.component';
import { InfoButtonComponent } from '../../components/ui-components/info-button/info-button.component';
import { MaterialModule } from '../../modules/third-party/material.module';
import { AssociatedDiseasesComponent } from '../../components/shared/associated-diseases/associated-diseases.component';
import { AssociatedDiseaseCategoriesComponent } from '../../components/shared/associated-disease-categories/associated-disease-categories.component';
import { NoContentComponent } from '../../components/shared/no-content/no-content.component';

@NgModule({
  declarations: [
    GeneComponent,
    ResearchDataComponent,
    GeneOntologyComponent,
    HumanProteinAtlasComponent,
    ExpressionComponent,
    GeneLocationComponent,
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
    NgToArrayPipeModule,
    SidebarModule,
    DirectivesModule,
    GeneReferenceModule,
    PublicationInfoModule,
    NgSplitPipeModule,
    ResearchTablesModule,
    BreadcrumbsComponent,
    SkeletonLoaderComponent,
    TagComponent,
    IconComponent,
    GeneAgeComponent,
    InfoButtonComponent,
    MaterialModule,
    AssociatedDiseasesComponent,
    AssociatedDiseaseCategoriesComponent,
    NoContentComponent,
  ],
})
export class GeneModule {}
