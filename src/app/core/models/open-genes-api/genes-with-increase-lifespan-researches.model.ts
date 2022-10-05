import { PurpleTable } from './studies.model';

export interface GenesWLifespanResearches {
  id: number;
  symbol: string;
  name: string;
  ncbiId: number;
  uniprot: string;
  ensembl: string;
  methylationCorrelation: string;
  researches: {
    increaseLifespan: PurpleTable[];
  };
}
