export interface Diet {
  id: number;
  name: string;
  symbol: string;
  ncbiId: string;
  uniprot: string;
  ensembl: string;
  isHidden: number;
  calorieRestrictionExperiments: Calorie[];
}

export interface Calorie {
  lexpressionChangeLogFc: number;
  pValue: string;
  crResult: string;
  measurementMethod: string;
  measurementType: string;
  restrictionPercent: number;
  age: string;
  ageUnit: string;
  duration: number;
  durationUnit: string;
  organism: string;
  line: string;
  sex: string;
  tissue: string;
  experimentNumber: string;
  doi: string;
  experimentGroupQuantity: string;
  expressionChangePercent: number;
  isoform: string;
}
