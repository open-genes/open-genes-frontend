export interface Genes {
  id: number;
  symbol: string;
  aliases: string[];
  name: string;
  entrezGene: number;
  uniprot: string;
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
  commentsReferenceLinks: string;
  rating: any;
  functionalClusters: string | string[];
  dateAdded: number;
  userEdited: string;
  expression: Array<any>;
  expressionEN: string;
  expressionChange: any;
  origin: Origin;
}

export interface Origin {
  id: number;
  phylum: string;
  age: string;
  order: number;
}
