
export class CancerType {
  title?: string;
  patienttypeid?: number;
  parentId?: string;
  cancerId?: number;
  subcancerType1Id?: number;
  subCancerType2Id?: number;
  subCancers?: CancerType[];
}
