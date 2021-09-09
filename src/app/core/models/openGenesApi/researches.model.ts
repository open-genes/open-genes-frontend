export interface increaseLifespan {
  interventionType: string;
  interventionResult: string;
  modelOrganism: string; // TODO: backend: rename to 'object'
  organismLine: string; // TODO: backend: rename to 'line'
  age: string;
  genotype: '+-' | '--';
  valueForMale: string;
  valueForFemale: string;
  valueForAll: string;
  doi: string;
  pmid: string;
  comment: string;
}

export interface AgeRelatedChanges {
  changeType: string;
  sample: string;
  modelOrganism: string; // TODO: backend: rename to 'object'
  organismLine: string;
  ageFrom: string;
  ageTo: string;
  valueForMale: string;
  valueForFemale: string;
  valueForAll: string;
  measurementType: string;
  doi: string;
  pmid: string;
  comment: string;
}

export interface InterventionAffectsAgingProcess {
  geneIntervention: string;
  interventionResult: string; // TODO: misleading name, rename
  vitalProcess: string;
  modelOrganism: string; // TODO: backend: rename to 'object'
  organismLine: string; // TODO: backend: rename to 'line'
  genotype: string;
  age: string;
  sex: string;
  doi: string;
  pmid: string;
  comment: string;
}

export interface ProteinRegulatesGenes {
  proteinActivity: string;
  regulationType: string;
  doi: string;
  pmid: string;
  comment: string;
  regulatedGene: {
    id: number;
    symbol: string;
    name: string;
    ncbiId: number;
  };
}

export interface ProgeriaSyndromes {
  progeriaSyndrome: string;
  doi: string;
  pmid: string;
  comment: string;
}

export interface LongevityEffects {
  allelicPolymorphism: string;
  allelicVariant: string;
  changeType: string; // TODO: backend: rename to 'charsOfTranscriptomeOrProteome'
  comment: string;
  dataType: string;
  longevityEffect: string; // TODO: backend: rename to 'phenotype'
  modelOrganism: string;
  doi: string;
  pmid: string;
  sex: string;
}

export interface AdditionalEvidences {
  doi: string;
  pmid: string;
  comment: string;
}

// TODO: backend: misleading names of researches
export interface Researches {
  increaseLifespan: increaseLifespan[];
  ageRelatedChangesOfGene: AgeRelatedChanges[];
  interventionToGeneImprovesVitalProcesses: InterventionAffectsAgingProcess[];
  proteinRegulatesOtherGenes: ProteinRegulatesGenes[];
  geneAssociatedWithProgeriaSyndromes: ProgeriaSyndromes[];
  geneAssociatedWithLongevityEffects: LongevityEffects[];
  additionalEvidences: AdditionalEvidences[];
}
