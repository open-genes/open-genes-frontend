export interface Research {
  doi: string;
  pmid: string;
  comment: string;
}

// purple form
interface PurpleTableSample {
  interventionWay: string;
  interventionMethod: string;
  genotype: string;
  tissueSpecific: boolean;
  tissueSpecificPromoter: null;
  tissues: {
    id: number;
    name: string;
  }[];
  inductionByDrugWithdrawal: boolean;
  drug: string;
  treatmentPeriod: string;
  treatmentDescription: string;
  drugDeliveryWay: string;
  treatmentStart: number;
  startStageOfDevelopment: string;
  startTimeUnit: string;
  treatmentEnd: number;
  endStageOfDevelopment: string;
  endTimeUnit: string;
}

interface InterventionResult {
  id: string;
  name: string;
}

export interface PurpleTable extends Research {
  modelOrganism: string;
  organismLine: string;
  sex: string;
  controlCohortSize: number;
  experimentCohortSize: number;
  density: number;
  temperatureFrom: number;
  temperatureTo: number;
  diet: string;
  interventions: {
    controlAndExperiment: PurpleTableSample[] & {
      gene: {
        id: number;
        symbol: string;
        name: string;
        ncbiId: string;
      };
    };
    experiment: PurpleTableSample[];
  };
  interventionResultForLifespan: string;
  expressionChangePercent: number;
  expressionMeasurementType: string;
  expressionChangeTissue: string;
  lifespanMinControl: number;
  lifespanMeanControl: number;
  lifespanMedianControl: number;
  lifespanMaxControl: number;
  lifespanMinExperiment: number;
  lifespanMeanExperiment: number;
  lifespanMedianExperiment: number;
  lifespanMaxExperiment: number;
  lifespanTimeUnit: string;
  lifespanMinChangePercent: number;
  lMinChangeStatSignificance: string;
  lifespanMeanChangePercent: number;
  lMeanChangeStatSignificance: string;
  lifespanMedianChangePercent: number;
  lMedianChangeStatSignificance: string;
  lifespanMaxChangePercent: number;
  lMaxChangeStatSignificance: string;
  interventionImproves: InterventionResult[];
  interventionDeteriorates: InterventionResult[];
}

// blue form
export interface BlueTable extends Research {
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

//  green form
export interface GreenTable extends Research {
  geneIntervention: string;
  modelOrganism: string; // TODO: backend: rename to 'object'
  organismLine: string; // TODO: backend: rename to 'line'
  interventionDeteriorates: InterventionResult[];
  interventionImproves: InterventionResult[];
  interventionResult: string; // TODO: misleading name, rename
  vitalProcess: string;
  age: string;
  genotype: '+-' | '--';
  sex: string;
}

// yellow form
export interface YellowTable extends Research {
  proteinActivity: string;
  regulationType: string;
  regulatedGene: {
    id: number;
    symbol: string;
    name: string;
    ncbiId: number;
  };
}

// orange form
export interface OrangeTable extends Research {
  progeriaSyndrome: string;
}

// pink form
export interface PinkTable extends Research {
  allelicPolymorphism: string;
  allelicVariant: string;
  changeType: string; // TODO: backend: rename to 'charsOfTranscriptomeOrProteome'
  dataType: string;
  longevityEffect: string; // TODO: backend: rename to 'phenotype'
  modelOrganism: string;
  sex: string;
}

// gray form
export type GrayTable = Research;

// TODO: backend: misleading names of researches
export interface Researches {
  increaseLifespan: PurpleTable[];
  ageRelatedChangesOfGene: BlueTable[];
  interventionToGeneImprovesVitalProcesses: GreenTable[];
  proteinRegulatesOtherGenes: YellowTable[];
  geneAssociatedWithProgeriaSyndromes: OrangeTable[];
  geneAssociatedWithLongevityEffects: PinkTable[];
  additionalEvidences: GrayTable[];
}
