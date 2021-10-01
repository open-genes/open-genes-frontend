import { AssociatedDiseaseCategories } from '../../../core/models/openGenesApi/associated-diseases.model';
import { FunctionalClusters } from '../../../core/models';

export interface Node {
  id?: number;
  name: string;
  group?: number;
}

export interface Link {
  id?: number;
  source: string | number;
  target: string | number;
  value?: number;
}

export interface DiagramGenes {
  id: number;
  name: string;
  expressionChange: number;
  homologueTaxon: string;
  familyOriginId: number;
  originId: number;
  functionalClusters: FunctionalClusters[];
  diseaseCategories: AssociatedDiseaseCategories;
}
