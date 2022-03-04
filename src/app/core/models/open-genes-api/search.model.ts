import { Genes } from './genes.model';

export interface SearchModel {
  items: Pick<Genes, 'id' | 'name' | 'symbol' | 'aliases' | 'ensembl'>[];
  found: string[];
  notFound: string[];
}


