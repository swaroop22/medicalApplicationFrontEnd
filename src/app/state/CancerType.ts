
export class CancerType {
  title: string;
  patientId: number;
  parentId: string;
  cancerId: string;
  subcancerType1Id: string;
  subCancerType2Id: string;
  subCancers: CancerType[];
}
