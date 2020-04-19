export interface Lifespan {
  interventionType: string;
  interventionResult: string;
  modelOrganism: string;
  organismLine: string;
  age: string;
  valueForMale: any; // TODO: бэк не должен возвращать null
  valueForFemale: any; // TODO: бэк не должен возвращать null
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
  valueForMale: any; // TODO: бэк не должен возвращать null
  valueForFemale: any; // TODO: бэк не должен возвращать null
  valueForAll: string;
  reference: string;
  comment: string;
}

export interface InterventionAffectsAgingProcess {
  geneIntervention: string;
  interventionResultForVitalProcess: string; // TODO: переименовать название вводящее в заблуждение
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
  reference: string ;
  comment: string;
}

export interface LongevityEffects {
  longevityEffect: string;
  allelicPolymorphism: string;
  sex: string;
  reference: string ;
  comment: string;
}

export interface Researches {
  increaseLifespan: Lifespan[];
  ageRelatedChangesOfGene: AgeRelatedChanges[];
  interventionToGeneImprovesVitalProcesses: InterventionAffectsAgingProcess[];
  proteinRegulatesOtherGenes: ProteinRegulatesGenes[];
  geneAssociatedWithProgeriaSyndromes: ProgeriaSyndromes[];
  geneAssociatedWithLongevityEffects: LongevityEffects[];
}
