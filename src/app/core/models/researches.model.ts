export interface Lifespan {
  interventionType: string;
  interventionResult: string;
  modelOrganism: string;
  organismLine: string;
  age: string;
  genotype: string; // Can have only these values: ++/--/+- TODO: change response to 0, 1, -1?
  valueForMale: any; // TODO: backend shouldn't return null, but an empty value of the same type
  valueForFemale: any; // TODO: backend shouldn't return null, but an empty value of the same type
  valueForAll: string;
  reference: string;
  comment: string;
}

export interface AgeRelatedChanges {
  changeType: string;
  sample: string;
  modelOrganism: string;
  organismLine: string;
  ageFrom: string;
  ageTo: string;
  valueForMale: any; // TODO: backend shouldn't return null, but an empty value of the same type
  valueForFemale: any; // TODO: backend shouldn't return null, but an empty value of the same type
  valueForAll: any; // TODO: backend shouldn't return null, but an empty value of the same type
  measurementType: string; // "MRNA" or "protein" in English version. TODO: change response to 0 and 1?
  reference: string;
  comment: string;
}

export interface InterventionAffectsAgingProcess {
  geneIntervention: string;
  interventionResultForVitalProcess: string; // TODO: misleading name, rename
  vitalProcess: string;
  modelOrganism: string;
  organismLine: string;
  age: string;
  sex: string;
  reference: string;
  comment: string;
}

export interface ProteinRegulatesGenes {
  proteinActivity: string;
  reference: string;
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
  reference: string;
  comment: string;
}

export interface LongevityEffects {
  longevityEffect: string;
  allelicPolymorphism: string;
  sex: string;
  reference: string;
  comment: string;
}

export interface Researches {
  // TODO: backend should always return these fields, not only when the form is filled
  increaseLifespan: Lifespan[];
  ageRelatedChangesOfGene: AgeRelatedChanges[];
  interventionToGeneImprovesVitalProcesses: InterventionAffectsAgingProcess[];
  proteinRegulatesOtherGenes: ProteinRegulatesGenes[];
  geneAssociatedWithProgeriaSyndromes: ProgeriaSyndromes[];
  geneAssociatedWithLongevityEffects: LongevityEffects[];
}
