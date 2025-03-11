import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditionalEvidencesComponent } from './additional-evidences/additional-evidences.component';
import { AgeRelatedChangesComponent } from './age-related-changes/age-related-changes.component';
import { ResearchesPageComponent } from './increase-lifespan/increase-lifespan.component';
import { InterventionAffectsAgingProcessComponent } from './intervention-affects-aging-process/intervention-affects-aging-process.component';
import { GeneAssociatedWithProgeriaSyndromesComponent } from './gene-associated-with-progeria-syndromes/gene-associated-with-progeria-syndromes.component';
import { GeneAssociatedWithLongevityEffectsComponent } from './gene-associated-with-longevity-effects/gene-associated-with-longevity-effects.component';
import { ProteinRegulatesOtherGenesComponent } from './protein-regulates-other-genes/protein-regulates-other-genes.component';
import { TranslateModule } from '@ngx-translate/core';
import { PublicationInfoModule } from '../publication-info/publication-info.module';
import { PipesModule } from '../../../core/pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/modules/third-party/material.module';
import { NgCapitalizePipeModule } from "angular-pipes";
import { DirectivesModule } from "../../../directives/directives.module";
import {InfoButtonComponent} from "../../ui-components/info-button/info-button.component";

const components = [
  AdditionalEvidencesComponent,
  AgeRelatedChangesComponent,
  ResearchesPageComponent,
  InterventionAffectsAgingProcessComponent,
  GeneAssociatedWithProgeriaSyndromesComponent,
  GeneAssociatedWithLongevityEffectsComponent,
  ProteinRegulatesOtherGenesComponent,
];

@NgModule({
  declarations: [...components],
    imports: [
        CommonModule,
        TranslateModule,
        PipesModule,
        PublicationInfoModule,
        RouterModule,
        MaterialModule,
        NgCapitalizePipeModule,
        DirectivesModule,
        InfoButtonComponent
    ],
  exports: [...components],
})
export class ResearchTablesModule {}
