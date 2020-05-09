export class RegimenDetail {
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
}

export class RegimenReference {
  id: number;
  reference: string;
}

export class Brand {
  id: number;
  brandName: string;
  genericName: string;
  manufacturer: string;
}
