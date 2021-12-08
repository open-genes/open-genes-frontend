import { AssociatedDiseaseCategories } from '../../../core/models/open-genes-api/associated-diseases.model';
import { FunctionalClusters } from '../../../core/models';
import { Origin } from '../../../core/models/open-genes-api/origin.model';

export interface Node {
  id?: number;
  name: string;
  group?: number;
}

export interface Link {
  id?: number;
  source: string | number;
  target: string | number;
  group?: number;
  data?: any
}

export interface DiagramGenes {
  id: number;
  name: string;
  expressionChange: number;
  homologueTaxon: string;
  familyOrigin: Origin;
  originId: number;
  functionalClusters: FunctionalClusters[];
  diseaseCategories: AssociatedDiseaseCategories;
}
