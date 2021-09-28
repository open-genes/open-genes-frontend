import { AssociatedDiseaseCategories } from '../../../core/models/openGenesApi/associated-diseases.model';

export interface Node {
  name: string;
  group?: number;
}

export interface Link {
  source: string | number;
  target: string | number;
}

export interface DiagramGenes {
  id: number;
  name: string;
  expressionChange: number;
  homologueTaxon: string;
  familyOriginId: number;
  originId: number;
  functionalClusters: string | string[];
  diseaseCategories: AssociatedDiseaseCategories;
}
