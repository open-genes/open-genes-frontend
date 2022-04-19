export interface Research {
  doi: string;
  pmid: string;
  comment: string;
}

// purple form
interface PurpleTableExperimentConditions {
  experimentMainEffect: string; // ✅
  interventionWay: string; // ✅
  interventionMethod: string; // ✅
  genotype: string; // ✅
  // The tissue specificity fields:
  tissueSpecific: boolean; // ✅
  tissueSpecificPromoter: string; // ✅
  tissues:
    | {
        id: number;
        name: string;
      }[]
    | []; // ✅
  // The drug therapy fields:
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
  // Intervention with an impact on another gene
  // (exists if there is an additional intervention)
  gene?: {
    id: number;
    symbol: string;
    name: string;
    ncbiId: string;
  };
}

interface InterventionResult {
  id: string;
  name: string;
}

export interface PurpleTable extends Research {
  modelOrganism: string; // ✅
  organismLine: string; // ✅
  sex: string; // ✅
  controlCohortSize: number; // ✅
  experimentCohortSize: number; // ✅
  populationDensity: string; // ✅
  temperatureFrom: number; // ✅
  temperatureTo: number; // ✅
  diet: string; // ✅
  interventionResultForLifespan: string; // ✅
  expressionChangePercent: number; // ✅
  expressionMeasurementType: string;
  expressionChangeTissue: string;
  lifespanMinControl: number; // ✅
  lifespanMeanControl: number; // ✅
  lifespanMedianControl: number; // ✅
  lifespanMaxControl: number; // ✅
  lifespanMinExperiment: number; // ✅
  lifespanMeanExperiment: number; // ✅
  lifespanMedianExperiment: number; // ✅
  lifespanMaxExperiment: number; // ✅
  lifespanTimeUnit: string; // ✅
  lifespanMinChangePercent: number; // ✅
  lMinChangeStatSignificance: boolean | null; // ✅
  lifespanMeanChangePercent: number; // ✅
  lMeanChangeStatSignificance: boolean | null; // ✅
  lifespanMedianChangePercent: number; // ✅
  lMedianChangeStatSignificance: boolean | null;
  lifespanMaxChangePercent: number; // ✅
  lMaxChangeStatSignificance: boolean | null; // ✅
  interventionImproves: InterventionResult[] | []; // ✅
  interventionDeteriorates: InterventionResult[] | []; // ✅
  interventions: {
    controlAndExperiment: PurpleTableExperimentConditions[];
    experiment: PurpleTableExperimentConditions[];
  };
}

// blue form
export interface BlueTable extends Research {
  modelOrganism: string;
  organismLine: string;
  sample: string;
  maxAgeOfControls: number | null;
  maxAgeOfExperiment: number | null;
  meanAgeOfControls: number | null;
  meanAgeOfExperiment: number | null;
  minAgeOfControls: number | null;
  minAgeOfExperiment: number | null;
  pValue: number | null; // new
  changeType: string; // new
  ageUnit: string; // new
  controlCohortSize: string | null; // new
  experimentCohortSize: string | null; // new
  ageFrom: string; // TODO: backend should remove this old field
  ageTo: string; // TODO: backend should remove this old field
  sex: string;
  value: string; // new // TODO: backend should rename 'percentChange'
  statisticalMethod: string | null; // new
  expressionEvaluationBy: string; // new // example: белок // new
  measurementMethod: string | null; // new
  measurementType: string | null; // TODO: backend should remove this field
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
