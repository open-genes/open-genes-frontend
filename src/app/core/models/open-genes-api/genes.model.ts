import { Studies } from './researches.model';
import { Origin } from './origin.model';
import { Terms, TermsLegacy } from './gene-ontology.model';
import { HumanProteinAtlas } from './human-protein-atlas.model';
import { AssociatedDiseases, AssociatedDiseaseCategories } from './associated-diseases.model';
import { MethylationCorrelation } from './methylation-correlation.model';
import { GeneLocation } from './gene-location.model';

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
export type Phylum = GenericItem;

interface GeneralGeneInfo {
  id: number;
  symbol: string;
  ensembl: string;
  agingMechanisms: AgingMechanisms[];
  aliases: string[];
  commentCause?: SelectionCriteria[];
  diseaseCategories?: AssociatedDiseaseCategories[];
  diseases?: AssociatedDiseases[];
  expressionChange?: number;
  functionalClusters: AgeRelatedProcesses[];
  proteinClasses: ProteinClasses[];
  name: string;
  familyOrigin?: Origin;
  origin?: Origin;
  ncbiId: number;
  uniprot: string;
  timestamp?: TimestampObject | string; // TODO: separate models for different API versions
  homologueTaxon: string;
  methylationCorrelation: MethylationCorrelation;
}

export interface Symbols {
  id: number;
  symbol: string;
}

export interface Genes extends GeneralGeneInfo {
  researches?: Studies; // if `researches=1` query parameter passed
  terms?: TermsLegacy;
}

export interface Ortholog {
  id: number;
  species: {
    commonName: string;
    latinName: string;
  };
  symbol: string;
  externalBaseId: number;
  externalBaseName: string;
}

export interface Gene extends GeneralGeneInfo {
  location: GeneLocation;
  accPromoter: any;
  accOrf: string;
  accCds: string;
  descriptionNCBI: string;
  references: string;
  ortholog: Ortholog[];
  orthologs: {
    [n: string]: string;
  };
  commentEvolution: string;
  commentEvolutionEN: string;
  commentAging: string;
  proteinDescriptionUniProt: string;
  proteinDescriptionOpenGenes: string;
  commentAgingEN: string;
  researches: Studies;
  expression: {
    name: string;
    exp_rpkm: number;
  }[];
  terms?: Terms;
  commentsReferenceLinks: { [n: number]: string };
  humanProteinAtlas: HumanProteinAtlas | '';
}
