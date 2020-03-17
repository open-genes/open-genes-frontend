import {Researches} from './researches.model';
import {Origin} from './origin.model';
import {Terms} from './gene-ontology.model';

export interface Genes {
  id: number;
  symbol: string;
  aliases: string[];
  name: string;
  entrezGene: number;
  uniprot: string;
  functionalClusters: string | string[];
  expressionChange: any;
  origin: Origin;
}

export interface Gene {
  id: number;
  symbol: string;
  aliases: string[];
  name: string;
  entrezGene: number;
  uniprot: string;
  functionalClusters: string | string[];
  origin: Origin;
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
  commentCause: string;
  commentAging: string;
  commentEvolutionEN: string;
  commentFunctionEN: string;
  commentAgingEN: string;
  researches: Researches;
  expression: Array<any>;
  expressionEN: string;
  proteinClasses: string[];
  terms: Terms;
  commentsReferenceLinks: any;
  rating: any;
}

