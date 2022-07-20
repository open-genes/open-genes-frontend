export type ResearchArguments =
  | 'lifespan-change'
  | 'age-related-changes'
  | 'gene-activity-change-impact'
  | 'gene-regulation'
  | 'association-with-accelerated-aging'
  | 'associations-with-lifespan'
  | 'other-evidence';

// Fields that present in the request in api/research endpoints
interface ResearchOptionalFields {
  geneId?: number;
  geneNcbiId?: number;
  geneName?: string;
  geneSymbol?: string;
  geneAliases?: string[];
}

export interface Research extends ResearchOptionalFields {
  doi: string;
  pmid: string;
  comment: string;
}

// purple form
interface PurpleTableExperimentConditions {
  experimentMainEffect: string;
  interventionWay: string;
  interventionMethod: string;
  genotype: string;
  tissueSpecific: boolean;
  tissueSpecificPromoter: string;
  tissues:
    | {
        id: number;
        name: string;
      }[]
    | [];
  // The drug therapy fields:
  inductionByDrugWithdrawal: boolean;
  drug: string;
  treatmentPeriod: string; // TODO: misleading name, rename to 'treatmentPeriodicity'
  treatmentDescription: string;
  drugDeliveryWay: string;
  treatmentStart: number;
  startStageOfDevelopment: string;
  startTimeUnit: string;
  treatmentEnd: number;
  endStageOfDevelopment: string;
  endTimeUnit: string;
  gene: number;
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
  populationDensity: string;
  temperatureFrom: number;
  temperatureTo: number;
  diet: string;
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
  lifespanTimeUnit: string | null;
  lifespanMinChangePercent: number;
  lMinChangeStatSignificance: boolean | null;
  lifespanMeanChangePercent: number;
  lMeanChangeStatSignificance: boolean | null;
  lifespanMedianChangePercent: number;
  lMedianChangeStatSignificance: boolean | null;
  lifespanMaxChangePercent: number;
  lMaxChangeStatSignificance: boolean | null;
  interventionImproves: InterventionResult[] | [];
  interventionDeteriorates: InterventionResult[] | [];
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
  pValue: number | null;
  changeType: string;
  ageUnit: string;
  controlCohortSize: string | null;
  experimentCohortSize: string | null;
  ageFrom: string; // TODO: backend should remove this old field
  ageTo: string; // TODO: backend should remove this old field
  sex: string;
  value: string; // TODO: backend should rename 'percentChange'
  statisticalMethod: string | null;
  expressionEvaluationBy: string; // example: белок
  measurementMethod: string | null;
  measurementType: string | null; // TODO: backend should remove this old field
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
  genotype: string; // example: '+-', '--'
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
  polymorphismId: string | null; // example: 'rs4130113'
  associatedAllele: string | null; // example: 'AA, GG'
  changeType: string | null; // example: decreased gene expression
  dataType: string | null; // example: 1en TODO: this is wrong, should be: 'genomic'
  longevityEffect: string | null; // TODO: backend: rename to 'phenotype'
  modelOrganism: string | null; // always human
  sex: string | null;
  nucleotideChange: string | null;
  aminoAcidChange: string | null;
  polymorphismOther: string | null;
  nonAssociatedAllele: string | null;
  frequencyControls: string | null;
  frequencyExperiment: string | null;
  minAgeOfControls: string | null;
  maxAgeOfControls: string | null;
  meanAgeOfControls: string | null;
  minAgeOfExperiment: string | null;
  maxAgeOfExperiment: string | null;
  meanAgeOfExperiment: string | null;
  nOfControls: string | null;
  nOfExperiment: string | null;
  position: string | null; // example: exon, missens
  polymorphismType: string | null;
  ethnicity: string | null;
  studyType: string | null;
  location?: string | null; // TODO: Will be added according to OG-809
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

export type ResearchTypes =
  | PurpleTable[]
  | BlueTable[]
  | GreenTable[]
  | YellowTable[]
  | OrangeTable[]
  | PinkTable[]
  | GrayTable[];
