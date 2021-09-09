export interface AssociatedDiseases {
  [n: number]: {
    icd_id: string;
    name: string;
  };
}
export interface AssociatedDiseaseCategories {
  [categoryIcdCode: string]: {
    icd_category_name: string;
  };
}
