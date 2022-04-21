export interface GeneLocation {
  accCds: string;
  accOrf: string;
  accPromoter: string;
  band: string;
  chromosome: number;
  locationEnd: number;
  locationStart: number;
  orientation: number;
  transcripts: Transcript[];
}

interface Transcript {
  id: number;
  name: string;
  accVersion: string;
  exons: Exon[];
  genomicRangeAccVersion: string;
  genomicRangeBegin: number;
  genomicRangeEnd: number;
  genomicRangeOrientation: number;
  length: number;
}

interface Exon {
  id: number;
  begin: number;
  end: number;
  order: number;
}
