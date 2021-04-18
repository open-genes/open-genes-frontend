import { Researches } from "./researches.model";
import { Origin } from "./origin.model";
import { Terms } from "./gene-ontology.model";
import { HumanProteinAtlas } from "./human-protein-atlas.model";
import { SelectionCriteria } from "./selection-criteria.model";

export interface Genes {
  id: number;
  symbol: string;
  aliases: string[];
  name: string;
  ncbiId: number;
  uniprot: string;
  functionalClusters: string | string[];
  expressionChange?: number;
  origin: Origin;
  homologueTaxon: string;
  timestamp: string;
  terms?: Terms;
}

export interface Gene {
  id: number;
  symbol: string;
  aliases: string[];
  name: string;
  ncbiId: number;
  uniprot: string;
  functionalClusters: string | string[];
  origin: Origin;
  homologueTaxon: string;
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
  commentCause: SelectionCriteria[];
  commentAging: string;
  commentEvolutionEN: string;
  commentFunctionEN: string;
  commentAgingEN: string;
  researches: Researches;
  expression: Array<any>;
  expressionEN: string;
  proteinClasses: string[]; // TODO: they don't match by order with human_protein_atlas.ProteinClass
  terms?: Terms;
  commentsReferenceLinks: any;
  rating: any;
  timestamp: any;
  human_protein_atlas: HumanProteinAtlas; // TODO: ask backend to change field name to camelCase
}
