export interface Origin {
  id: number;
  phylum: string;
  age: string;
  order: number;
}

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
  expression: Array<any>;
  expressionEN: string;
  commentsReferenceLinks: any;
  rating: any;
}

