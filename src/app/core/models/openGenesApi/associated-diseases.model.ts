export interface AssociatedDiseases {
  [n: string]: {
    icdId: string;
    name: string;
    icdName: string;
  };
}
export interface AssociatedDiseaseCategories {
  [categoryIcdCode: string]: {
    icdCategoryName: string;
  };
}
