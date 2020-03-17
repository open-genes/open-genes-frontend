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

export interface GeneInterventions {
  geneIntervention: string;
  interventionResultForVitalProcess: string;
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
    entrezGene: number;
  };
}

export interface Researches {
  increaseLifespan: Lifespan[];
  geneAssociatedWithProgeriaSyndromes: ProgeriaSyndromes[];
  geneAssociatedWithLongevityEffects: LongevityEffects[];
  ageRelatedChangesOfGene: AgeRelatedChanges[];
  interventionToGeneImprovesVitalProcesses: GeneInterventions[];
  proteinRegulatesOtherGenes: ProteinRegulatesGenes[];
}
