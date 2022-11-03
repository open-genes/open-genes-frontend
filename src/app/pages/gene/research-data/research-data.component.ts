import { Component, Input, OnInit } from '@angular/core';
import { Studies } from '../../../core/models/open-genes-api/researches.model';

@Component({
  selector: 'app-research-data',
  templateUrl: './research-data.component.html',
  styleUrls: ['./research-data.component.scss'],
})
export class ResearchDataComponent implements OnInit {
  @Input() studies: Studies;
  @Input() slice = 20;

  public isIncreaseLifespan: boolean;
  public isAgeRelatedChanges: boolean;
  public isInterventionAffectsAgingProcess: boolean;
  public isProteinRegulatesOtherGenes: boolean;
  public isGeneAssociatedWithProgeriaSyndromes: boolean;
  public isGeneAssociatedWithLongevityEffects: boolean;
  public isAdditionalEvidences: boolean;

  constructor() {}

  ngOnInit() {
    this.isIncreaseLifespan =
      this.studies?.increaseLifespan &&
      this.studies?.increaseLifespan.length !== 0;

    this.isAgeRelatedChanges =
      this.studies?.ageRelatedChangesOfGene &&
      this.studies?.ageRelatedChangesOfGene.length !== 0;

    this.isInterventionAffectsAgingProcess =
      this.studies?.interventionToGeneImprovesVitalProcesses &&
      this.studies?.interventionToGeneImprovesVitalProcesses.length !== 0;

    this.isProteinRegulatesOtherGenes =
      this.studies?.proteinRegulatesOtherGenes &&
      this.studies?.proteinRegulatesOtherGenes.length !== 0;

    this.isGeneAssociatedWithProgeriaSyndromes =
      this.studies?.geneAssociatedWithProgeriaSyndromes &&
      this.studies?.geneAssociatedWithProgeriaSyndromes.length !== 0;

    this.isGeneAssociatedWithLongevityEffects =
      this.studies?.geneAssociatedWithLongevityEffects &&
      this.studies?.geneAssociatedWithLongevityEffects.length !== 0;

    this.isAdditionalEvidences =
      this.studies?.additionalEvidences && this.studies?.additionalEvidences.length !== 0;
  }
}
