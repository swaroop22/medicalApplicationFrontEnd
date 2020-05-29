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
  brands: Brand[];
  regimenLevels: Level[];
}

export interface RegimenReference {
  id: number;
  reference: string;
}

export interface Brand {
  id: number;
  brandName: string;
  genericName: string;
  manufacturer: string;
}

export interface Level {
  id: number;
  level: string;
}
