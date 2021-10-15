import { Researches } from './researches.model';
import { Origin } from './origin.model';
import { Terms } from './gene-ontology.model';
import { HumanProteinAtlas } from './human-protein-atlas.model';
import { SelectionCriteria } from './selection-criteria.model';
import { AssociatedDiseases, AssociatedDiseaseCategories } from './associated-diseases.model';

interface GeneralGeneInfo {
  id: number;
  symbol: string;
  aliases: string[];
  commentCause?: SelectionCriteria;
  diseaseCategories?: AssociatedDiseaseCategories;
  diseases?: AssociatedDiseases;
  expressionChange?: number;
  functionalClusters: FunctionalClusters[];
  terms?: Terms;
  name: string;
  familyOrigin?: Origin;
  origin?: Origin;
  ncbiId: number;
  uniprot: string;
  timestamp: string;
  homologueTaxon: string;
  methylationCorrelation: 'positive' | 'negative' | '';
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
    string: string;
  };
  commentEvolution: string;
  commentEvolutionEN: string;
  proteinDescriptionUniProt: string;
  proteinDescriptionOpenGenes: string;
  commentAgingEN: string;
  researches: Researches;
  expression: Array<any>;
  expressionEN: string;
  proteinClasses: string[]; // TODO: they don't match by order with human_protein_atlas.ProteinClass
  terms?: Terms;
  commentsReferenceLinks: { [n: number]: string };
  rating: number; // TODO: delete this field
  human_protein_atlas: HumanProteinAtlas | ''; // TODO: ask backend to change field name to camelCase, return null or empty object if no fields
}

export interface FunctionalClusters {
  id: number;
  name: string;
}
