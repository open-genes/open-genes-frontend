/**
 * Human Protein Atlas Interface
 */
// TODO: add objects here gradually, as they all are implemented

export interface HumanProteinAtlas {
  /** Array of alpha-numeric IDs.
   *  Example: 0: "HPA005689"
   *  Search by ID: https://v18.proteinatlas.org/search/*ID*?format=*xml/tsv/rdf*&compress=no
   */
  Antibody?: string[];
  /** Ensembl ID */
  Ensembl?: string[];
  /** Array of strings.
   * Example: 0: "Cancer-related genes"
   */
  ProteinClass?: string[];
}
