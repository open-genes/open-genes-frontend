export interface AssociatedDiseases {
  id: number;
  name: string;
  icdId: string;
  icdName: string;
}

export interface AssociatedDiseaseCategories {
  id: number;
  icdCode: string;
  icdCategoryName: string;
}
