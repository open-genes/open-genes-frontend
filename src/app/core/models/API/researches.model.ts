export interface increaseLifespan {
  interventionType: string;
  longevityEffect: string;
  interventionResult: string;
  modelOrganism: string; // TODO: backend: rename to 'object'
  organismLine: string; // TODO: backend: rename to 'line'
  age: string;
  genotype: string; // Can have only these values: ++/--/+- TODO: change response to 0, 1, -1?
  valueForMale: any; // TODO: backend shouldn't return null, but an empty value of the same type
  valueForFemale: any; // TODO: backend shouldn't return null, but an empty value of the same type
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
  valueForMale: any; // TODO: backend shouldn't return null, but an empty value of the same type
  valueForFemale: any; // TODO: backend shouldn't return null, but an empty value of the same type
  valueForAll: any; // TODO: backend shouldn't return null, but an empty value of the same type
  measurementType: string;
  doi: string;
  pmid: string;
  comment: string;
}

export interface InterventionAffectsAgingProcess {
  geneIntervention: string;
  interventionResultForVitalProcess: string; // TODO: misleading name, rename
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
