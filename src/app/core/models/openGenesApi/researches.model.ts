export interface Research {
  doi: string;
  pmid: string;
  comment: string;
}

export interface increaseLifespan extends Research {
  interventionType: string;
  interventionResult: string;
  modelOrganism: string; // TODO: backend: rename to 'object'
  organismLine: string; // TODO: backend: rename to 'line'
  age: string;
  genotype: '+-' | '--';
  valueForMale: string;
  valueForFemale: string;
  valueForAll: string;
}

export interface AgeRelatedChanges extends Research {
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
}

export interface InterventionAffectsAgingProcess extends Research {
  geneIntervention: string;
  interventionResult: string; // TODO: misleading name, rename
  vitalProcess: string;
  modelOrganism: string; // TODO: backend: rename to 'object'
  organismLine: string; // TODO: backend: rename to 'line'
  genotype: string;
  age: string;
  sex: string;
}

export interface ProteinRegulatesGenes extends Research {
  proteinActivity: string;
  regulationType: string;
  regulatedGene: {
    id: number;
    symbol: string;
    name: string;
    ncbiId: number;
  };
}

export interface ProgeriaSyndromes extends Research {
  progeriaSyndrome: string;
}

export interface LongevityEffects extends Research {
  allelicPolymorphism: string;
  allelicVariant: string;
  changeType: string; // TODO: backend: rename to 'charsOfTranscriptomeOrProteome'
  dataType: string;
  longevityEffect: string; // TODO: backend: rename to 'phenotype'
  modelOrganism: string;
  sex: string;
}

export interface AdditionalEvidences extends Research {}

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
