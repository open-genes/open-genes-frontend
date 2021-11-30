import { MethylationCorrelation } from './methylation-correlation.model';

export interface GenesInHorvathClock {
  id: number;
  symbol: string;
  name: string;
  ncbiId: string;
  uniprot: string;
  ensembl: string;
  methylationCorrelation: MethylationCorrelation;
}
