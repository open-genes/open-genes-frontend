/**
 * Human Protein Atlas Interface
 */
// TODO: add objects here gradually, as they all are implemented

export interface HumanProteinAtlas {
  // --- Gene ---
  Gene: string; // TODO: УДАЛИТЬ
  GeneSynonym: string[]; // TODO: УДАЛИТЬ. Генам, у которых нет синонимов, добавить в поле aliases
  Ensembl: string; // Example: "ENSG00000197299"
  GeneDescription: string; // TODO: УДАЛИТЬ
  Uniprot: string[]; // Example: ["P54132"]
  Chromosome: string; // Example: 15
  Position: string; // Example: 90717327-90816165
  ProteinClass?: string[]; // Example: ["Cancer-related genes", "Disease related genes", ...]
  // --- Overlaps with Gene Ontology
  BiologicalProcess?: string[]; // Example: ["DNA damage", "DNA repair", ...] by UniProt
  MolecularFunction?: string[]; // Example: ["DNA-binding", "Helicase", ...] by UniProt
  SubcellularLocation?: string[];
  SubcellularMainLocation?: string[];
  SubcellularAdditionalLocation?: string[];
  // ---
  DiseaseInvolvement?: string[]; // Example: ["Cancer-related genes", "Disease mutation", ...]
  Evidence: string; // Example: "Evidence at protein level"
  /**
   *  Antibodies
   *  Array of alpha-numeric IDs.
   *  Example: 0: "HPA005689"
   *  Search by ID: https://v18.proteinatlas.org/search/*ID*?format=*xml/tsv/rdf*&compress=no
   */

  /** Antibodies supplied through commercial or other academic sources
   * Example: CAB002058
   */
  Antibody?: string[];


}
