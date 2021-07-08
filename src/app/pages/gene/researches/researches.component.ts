import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Researches } from '../../../core/models/API/researches.model';

@Component({
  selector: 'app-researches',
  templateUrl: './researches.component.html',
  styleUrls: ['./researches.component.scss'],
})
export class ResearchesComponent implements OnInit {
  @Input() researches: Researches;

  public isIncreaseLifespan: boolean;
  public isAgeRelatedChanges: boolean;
  public isInterventionAffectsAgingProcess: boolean;
  public isProteinRegulatesOtherGenes: boolean;
  public isGeneAssociatedWithProgeriaSyndromes: boolean;
  public isGeneAssociatedWithLongevityEffects: boolean;
  public isAdditionalEvidences: boolean;

  constructor(public translate: TranslateService) {}

  ngOnInit() {
    this.isIncreaseLifespan =
      this.researches?.increaseLifespan &&
      this.researches?.increaseLifespan.length !== 0;

    this.isAgeRelatedChanges =
      this.researches?.ageRelatedChangesOfGene &&
      this.researches?.ageRelatedChangesOfGene.length !== 0;

    this.isInterventionAffectsAgingProcess =
      this.researches?.interventionToGeneImprovesVitalProcesses &&
      this.researches?.interventionToGeneImprovesVitalProcesses.length !== 0;

    this.isProteinRegulatesOtherGenes =
      this.researches?.proteinRegulatesOtherGenes &&
      this.researches?.proteinRegulatesOtherGenes.length !== 0;

    this.isGeneAssociatedWithProgeriaSyndromes =
      this.researches?.geneAssociatedWithProgeriaSyndromes &&
      this.researches?.geneAssociatedWithProgeriaSyndromes.length !== 0;

    this.isGeneAssociatedWithLongevityEffects =
      this.researches?.geneAssociatedWithLongevityEffects &&
      this.researches?.geneAssociatedWithLongevityEffects.length !== 0;

    this.isAdditionalEvidences =
      this.researches?.additionalEvidences &&
      this.researches?.additionalEvidences.length !== 0;
  }
}
