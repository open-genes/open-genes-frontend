/**
 * Human Protein Atlas Interface
 */

export interface HumanProteinAtlas {
  Ensembl: string; // Example: "ENSG00000197299"
  Uniprot: string[]; // Example: ["P54132"]
  Chromosome: string; // Example: 15
  Position: string; // Example: 90717327-90816165
  ProteinClass: string[]; // Example: ["Cancer-related genes", "Disease related genes", ...]
  BiologicalProcess?: string[]; // Example: ["DNA damage", "DNA repair", ...] by UniProt
  MolecularFunction?: string[]; // Example: ["DNA-binding", "Helicase", ...] by UniProt
  SubcellularLocation?: string[];
  SubcellularMainLocation?: string[];
  SubcellularAdditionalLocation?: string[];
  DiseaseInvolvement?: string[]; // Example: ["Cancer-related genes", "Disease mutation", ...]
  Evidence: string; // Example: "Evidence at protein level"
}
