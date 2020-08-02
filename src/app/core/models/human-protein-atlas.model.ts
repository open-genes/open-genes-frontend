/**
 * Human Protein Atlas Interface
 */
// TODO: add objects here gradually, as they all are implemented

export interface HumanProteinAtlas {
  // --- Gene ---
  /** Array of alpha-numeric IDs.
   *  Example: 0: "HPA005689"
   *  Search by ID: https://v18.proteinatlas.org/search/*ID*?format=*xml/tsv/rdf*&compress=no
   */

  /** Antibodies supplied through commercial or other academic sources
   * Example: CAB002058
   */
  Antibody?: string[];

  /** Ensembl ID */
  Ensembl?: string[];

  /** Array of strings.
   * Example: 0: "Cancer-related genes"
   */
  ProteinClass?: string[];

  // --- Gene ---
  // Gene synonym
  // Ensembl gene id
  // Gene description
  // Uniprot accession
  // Chromosome
  // Chromosome position
  // Protein class
  // Biological process
  // Molecular function
  // Disease involvement
  //
  // --- Evidence ---
  // Evidence (summary)
  // HPA evidence
  // UniProt evidence
  // NeXtProt evidence
  // MS evidence
  //
  // --- RNA category human ---
  // RNA tissue specificity
  // RNA tissue distribution
  // RNA tissue specificity score
  // RNA tissue specific NX
  // RNA cell line specificity
  // RNA cell line distribution
  // RNA cell line specificity score
  // RNA cell line specific NX
  // RNA cancer specificity
  // RNA cancer distribution
  // RNA cancer specificity score
  // RNA cancer specific FPKM
  // RNA brain regional specificity
  // RNA brain regional distribution
  // RNA brain regional specificity score
  // RNA brain regional specific NX
  // RNA blood cell specificity
  // RNA blood cell distribution
  // RNA blood cell specificity score
  // RNA blood cell specific NX
  // RNA blood lineage specificity
  // RNA blood lineage distribution
  // RNA blood lineage specificity score
  // RNA blood lineage specific NX
  //
  // --- RNA category pig/mouse ---
  // RNA mouse brain regional specificity
  // RNA mouse brain regional distribution
  // RNA mouse brain regional specificity score
  // RNA mouse brain regional specific pTPM
  // RNA pig brain regional specificity
  // RNA pig brain regional distribution
  // RNA pig brain regional specificity score
  // RNA pig brain regional specific pTPM
  //
  //  --- Annotation ---
  // Antibody ID
  // Reliability (IH)
  // Reliability (Mouse Brain)
  // Reliability (IF)
  // Subcellular location
  // Secretome location
  // Subcellular main location
  // Subcellular additional location
  // Antibody RRID
  //
  // --- Blood concentration ---
  // Immunoassay [pg/L]
  // Mass spectrometry [pg/L]
  //
  // --- Pathology prognostics ---
  // Breast cancer
  // Cervical cancer
  // Colorectal cancer
  // Endometrial cancer
  // Glioma
  // Head and neck cancer
  // Liver cancer
  // Lung cancer
  // Melanoma
  // Ovarian cancer
  // Pancreatic cancer
  // Prostate cancer
  // Renal cancer
  // Stomach cancer
  // Testis cancer
  // Thyroid cancer
  // Urothelial cancer
  //
  // --- Tissue RNA ---
  // Adipose tissue [NX]
  // Adrenal gland [NX]
  // Amygdala [NX]
  // Appendix [NX]
  // Basal ganglia [NX]
  // Bone marrow [NX]
  // Breast [NX]
  // Cerebellum [NX]
  // Cerebral cortex [NX]
  // Cervix, uterine [NX]
  // Colon [NX]
  // Corpus callosum [NX]
  // Ductus deferens [NX]
  // Duodenum [NX]
  // Endometrium 1 [NX]
  // Epididymis [NX]
  // Esophagus [NX]
  // Fallopian tube [NX]
  // Gallbladder [NX]
  // Heart muscle [NX]
  // Hippocampal formation [NX]
  // Hypothalamus [NX]
  // Kidney [NX]
  // Liver [NX]
  // Lung [NX]
  // Lymph node [NX]
  // Midbrain [NX]
  // Olfactory region [NX]
  // Ovary [NX]
  // Pancreas [NX]
  // Parathyroid gland [NX]
  // Pituitary gland [NX]
  // Placenta [NX]
  // Pons and medulla [NX]
  // Prostate [NX]
  // Rectum [NX]
  // Retina [NX]
  // Salivary gland [NX]
  // Seminal vesicle [NX]
  // Skeletal muscle [NX]
  // Skin 1 [NX]
  // Small intestine [NX]
  // Smooth muscle [NX]
  // Spinal cord [NX]
  // Spleen [NX]
  // Stomach 1 [NX]
  // Testis [NX]
  // Thalamus [NX]
  // Thymus [NX]
  // Thyroid gland [NX]
  // Tongue [NX]
  // Tonsil [NX]
  // Urinary bladder [NX]
  // Vagina [NX]
  // B-cells [NX]
  // Dendritic cells [NX]
  // Granulocytes [NX]
  // Monocytes [NX]
  // NK-cells [NX]
  // T-cells [NX]
  // Total PBMC [NX]
  //
  // --- Cell RNA ---
  // A-431 [NX]
  // A549 [NX]
  // AF22 [NX]
  // AN3-CA [NX]
  // ASC diff [NX]
  // ASC TERT1 [NX]
  // BEWO [NX]
  // BJ [NX]
  // BJ hTERT+ [NX]
  // BJ hTERT+ SV40 Large T+ [NX]
  // BJ hTERT+ SV40 Large T+ RasG12V [NX]
  // CACO-2 [NX]
  // CAPAN-2 [NX]
  // Daudi [NX]
  // EFO-21 [NX]
  // FHDF/TERT166 [NX]
  // HaCaT [NX]
  // HAP1 [NX]
  // HBEC3-KT [NX]
  // HBF TERT88 [NX]
  // HDLM-2 [NX]
  // HEK 293 [NX]
  // HEL [NX]
  // HeLa [NX]
  // Hep G2 [NX]
  // HHSteC [NX]
  // HL-60 [NX]
  // HMC-1 [NX]
  // HSkMC [NX]
  // HTCEpi [NX]
  // HTEC/SVTERT24-B [NX]
  // HTERT-HME1 [NX]
  // HUVEC TERT2 [NX]
  // K-562 [NX]
  // Karpas-707 [NX]
  // LHCN-M2 [NX]
  // MCF7 [NX]
  // MOLT-4 [NX]
  // NB-4 [NX]
  // NTERA-2 [NX]
  // PC-3 [NX]
  // REH [NX]
  // RH-30 [NX]
  // RPMI-8226 [NX]
  // RPTEC TERT1 [NX]
  // RT4 [NX]
  // SCLC-21H [NX]
  // SH-SY5Y [NX]
  // SiHa [NX]
  // SK-BR-3 [NX]
  // SK-MEL-30 [NX]
  // T-47d [NX]
  // THP-1 [NX]
  // TIME [NX]
  // U-138 MG [NX]
  // U-2 OS [NX]
  // U-2197 [NX]
  // U-251 MG [NX]
  // U-266/70 [NX]
  // U-266/84 [NX]
  // U-698 [NX]
  // U-87 MG [NX]
  // U-937 [NX]
  // WM-115 [NX]
  //
  // --- Blood RNA ---
  // Basophil [NX]
  // Classical monocyte [NX]
  // Eosinophil [NX]
  // GdT-cell [NX]
  // Intermediate monocyte [NX]
  // MAIT T-cell [NX]
  // Memory B-cell [NX]
  // Memory CD4 T-cell [NX]
  // Memory CD8 T-cell [NX]
  // Myeloid DC [NX]
  // Naive B-cell [NX]
  // Naive CD4 T-cell [NX]
  // Naive CD8 T-cell [NX]
  // Neutrophil [NX]
  // NK-cell [NX]
  // Non-classical monocyte [NX]
  // Plasmacytoid DC [NX]
  // T-reg [NX]
  // Total PBMC [NX]
  //
  // --- Brain RNA ---
  // Amygdala [NX]
  // Basal ganglia [NX]
  // Cerebellum [NX]
  // Cerebral cortex [NX]
  // Hippocampal formation [NX]
  // Hypothalamus [NX]
  // Midbrain [NX]
  // Olfactory region [NX]
  // Pons and medulla [NX]
  // Thalamus [NX]
}
