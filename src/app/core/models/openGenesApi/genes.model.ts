import { Researches } from './researches.model';
import { Origin } from './origin.model';
import { Terms } from './gene-ontology.model';
import { HumanProteinAtlas } from './human-protein-atlas.model';
import { SelectionCriteria } from './selection-criteria.model';
import { AssociatedDiseases } from './associated-diseases.model';

interface GeneralGeneInfo {
  id: number;
  symbol: string;
  aliases: string[];
  commentCause: SelectionCriteria[];
  diseases: AssociatedDiseases[];
  expressionChange?: number;
  functionalClusters: string | string[];
  terms?: Terms;
  name: string;
  origin: Origin;
  ncbiId: number;
  uniprot: string;
  timestamp: number;
  homologueTaxon: string;
}

export type Genes = GeneralGeneInfo;

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
  orthologs: string;
  commentEvolution: string;
  commentFunction: string;
  commentAging: string;
  commentEvolutionEN: string;
  commentFunctionEN: string;
  commentAgingEN: string;
  descriptionNCBI: string;
  ensembl: string;
  expression: Array<any>;
  expressionEN: string;
  proteinClasses: string[]; // TODO: they don't match by order with human_protein_atlas.ProteinClass
  researches: Researches;
  terms?: Terms;
  commentsReferenceLinks: { [n: number]: string };
  rating: number; // TODO: delete this field
  human_protein_atlas: HumanProteinAtlas | ''; // TODO: ask backend to change field name to camelCase, return null or empty object if no fields
}
