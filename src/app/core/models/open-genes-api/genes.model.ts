import { Researches } from './researches.model';
import { Origin } from './origin.model';
import { Terms } from './gene-ontology.model';
import { HumanProteinAtlas } from './human-protein-atlas.model';
import { AssociatedDiseases, AssociatedDiseaseCategories } from './associated-diseases.model';
import { MethylationCorrelation } from './methylation-correlation.model';

interface TimestampObject {
  changed: string;
  created: string;
}

interface GenericItem {
  id: string;
  name: string;
}

export type AgingMechanisms = GenericItem;
export type ProteinClasses = GenericItem;
export type SelectionCriteria = GenericItem;
export type AgeRelatedProcesses = GenericItem;

interface GeneralGeneInfo {
  id: number;
  symbol: string;
  agingMechanisms: AgingMechanisms[];
  aliases: string[];
  commentCause?: SelectionCriteria[];
  diseaseCategories?: AssociatedDiseaseCategories;
  diseases?: AssociatedDiseases;
  expressionChange?: number;
  functionalClusters: AgeRelatedProcesses[];
  proteinClasses: ProteinClasses[];
  terms?: Terms;
  name: string;
  familyOrigin?: Origin;
  origin?: Origin;
  ncbiId: number;
  uniprot: string;
  timestamp?: TimestampObject | string; // TODO: separate models for different API versions
  homologueTaxon: string;
  methylationCorrelation: MethylationCorrelation;
}

export interface Genes extends GeneralGeneInfo {
  ensembl?: string;
}

export interface Gene extends GeneralGeneInfo {
  why: string;
  band: string;
  locationStart: number;
  locationEnd: number;
  orientation: number;
  accPromoter: any;
  accOrf: string;
  accCds: string;
  references: string;
  orthologs: {
    [n: string]: string;
  };
  commentEvolution: string;
  commentEvolutionEN: string;
  proteinDescriptionUniProt: string;
  proteinDescriptionOpenGenes: string;
  commentAgingEN: string;
  researches: Researches;
  expression: Array<any>;
  expressionEN: string;
  terms?: Terms;
  commentsReferenceLinks: { [n: number]: string };
  rating: number; // TODO: delete this field
  human_protein_atlas: HumanProteinAtlas | ''; // TODO: ask backend to change field name to camelCase, return null or empty object if no fields
}

export interface FilteredGenes {
  items: Genes[];
  options: {
    objTotal: number;
    pagination: {
      page: number;
      pageSize: number;
      pagesTotal: number;
    };
  };
}
