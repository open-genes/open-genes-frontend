import { Researches } from './researches.model';
import { Origin } from './origin.model';
import { Terms } from './gene-ontology.model';
import { HumanProteinAtlas } from './human-protein-atlas.model';
import { AssociatedDiseases, AssociatedDiseaseCategories } from './associated-diseases.model';
import { MethylationCorrelation } from './methylation-correlation.model';

interface TimestampObject {
  changed: string;
  created: string;
}

interface GenericItem {
  id: string;
  name: string;
}

export type AgingMechanisms = GenericItem;
export type ProteinClasses = GenericItem;
export type SelectionCriteria = GenericItem;
export type AgeRelatedProcesses = GenericItem;

interface GeneralGeneInfo {
  id: number;
  symbol: string;
  agingMechanisms: AgingMechanisms[];
  aliases: string[];
  commentCause?: SelectionCriteria[];
  diseaseCategories?: AssociatedDiseaseCategories;
  diseases?: AssociatedDiseases;
  expressionChange?: number;
  functionalClusters: AgeRelatedProcesses[];
  proteinClasses: ProteinClasses[];
  terms?: Terms;
  name: string;
  familyOrigin?: Origin;
  origin?: Origin;
  ncbiId: number;
  uniprot: string;
  timestamp?: TimestampObject | string; // TODO: separate models for different API versions
  homologueTaxon: string;
  methylationCorrelation: MethylationCorrelation;
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
  descriptionNCBI: string;
  references: string;
  ortholog: {
    id: number;
    species: {
      commonName: string;
      latinName: string;
    };
    symbol: string;
    externalBaseId: number;
    externalBaseName: string;
  }[];
  orthologs: {
    [n: string]: string;
  };
  commentEvolution: string;
  commentEvolutionEN: string;
  commentAging: string;
  proteinDescriptionUniProt: string;
  proteinDescriptionOpenGenes: string;
  commentAgingEN: string;
  researches: Researches;
  expression: Array<any>;
  expressionEN: string;
  terms?: Terms;
  commentsReferenceLinks: { [n: number]: string };
  humanProteinAtlas: HumanProteinAtlas | '';
}
