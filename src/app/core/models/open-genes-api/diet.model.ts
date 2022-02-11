export interface Diet {
  id: number;
  name: string;
  symbol: string;
  ncbiId: string;
  uniprot: string;
  ensembl: string;
  calorieRestrictionExperiments: Calorie[];
}

export interface Calorie {
  lexpressionChangeLogFc: number;
  pValue: string;
  crResult: string;
  measurementMethod: string;
  measurementType: string;
  restrictionPercent: number;
  restrictionTime: string;
  age: string;
  organism: string;
  line: string;
  sex: string;
  tissue: string;
  experimentNumber: string;
  doi: string;
  expressionChangePercent: number;
  isoform: string;
}
