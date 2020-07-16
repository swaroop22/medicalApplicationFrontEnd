export interface RegimenDetail {
  id: number;
  dispName: string;
  name: string;
  schedule: string;
  emetogenicPotential: string;
  references:  RegimenReference[];
  dosageModifications: string;
  regimenType:  string;
  brandNames:  string;
  brands: Drug[];
  regimenLevels: Level[];
  linkedToCancers?: string[];
}

export interface RegimenReference {
  id: number;
  referenceValue: string;
}

export interface Drug {
  id?: number;
  genericName?: string;
  drugBrandList?: DrugBrand[];
}

export interface DrugBrand {
  id?: number;
  brandName?: string;
  manufacturer?: string;
}

export interface Level {
  id: number;
  level: string;
}
