import {RegimenDetail} from './regimen-detail';

export interface Cancer {
  id?: number;
  patientType?: number;
  parentId?: number;
  title?: string;
  regimenList?: RegimenDetail[];
  regimenLevelsInCancer?: string[];
}
