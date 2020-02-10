import {Injectable} from '@angular/core';
import {PatientType} from '../state/PatientType';
import {CANCERS} from '../constants/constants';
import {CancerType} from '../state/CancerType';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class  CancerTreeService {
  cancer: any = {};

  parentCancers = [];
  subCancers = [];
  regimenDetails = [];
  allCancers: any[] = [];

  currentCancer: any = {};

  constructor(private router: Router,
              private route: ActivatedRoute,) {}

  getCurrentCancer() {
    return this.currentCancer;
  }

  addItem(json: any, type?) {
    switch (type) {
      case CANCERS.CANCER:
        this.addCancer(json);
        break;

      case CANCERS.PATIENT:
        this.addPatient(json);
        break;

      case CANCERS.REGIMEN_DETAILS:
        this.addRegimenDetails(json);
        break;

      default:
        this.addSubCancer(json, type);
        break;
    }
  }

  addPatient(patient: PatientType) {
    this.cancer[CANCERS.PATIENT] = patient
  }

  addCancer(cancers: CancerType[]) {
    if(cancers.length > 0)
    this.cancer[CANCERS.CANCER] = cancers;
  }

  addRegimenDetails(regimenDetails: any[]) {
    this.cancer[CANCERS.REGIMEN_DETAILS] = regimenDetails;
  }

  addSubCancer(subCancers: CancerType[], type) {
      this.cancer[type] = subCancers;
  }

  clearCurrentLevel() {
    delete this.cancer[this.getCurrentLevel()];
  }

  getCurrentLevel() {
    if(this.parentCancers && this.parentCancers.length > 0) {
      return 'SUBCANCER' + this.parentCancers.length + 'TYPE';
    } else if (!this.parentCancers){
      return 'CANCERYPE';
    }
  }

  getNextItemName() {
    if(this.parentCancers && this.parentCancers.length > 0) {
      return 'SUBCANCER' + (this.parentCancers.length + 1) + 'TYPE';
    } else if (!this.parentCancers){
      return 'SUBCANCER1TYPE';
    }
  }

  nextItemToFetch() {

    let currentLevel: string = this.getCurrentLevel();

    if(this.router.url.indexOf('regime') >= 0) {
         return CANCERS.REGIMEN_DETAILS;
    }

    if (!this.cancer[CANCERS.PATIENT] || this.router.url.indexOf('patientTypes') >= 0) {
      return CANCERS.PATIENT
    }
    else if (currentLevel === CANCERS.PATIENT) {
      return CANCERS.CANCER
    }  else if (currentLevel === CANCERS.CANCER) {
      return CANCERS.SUBCANCER1
    }  else if (currentLevel === CANCERS.SUBCANCER1) {
      return CANCERS.SUBCANCER2
    } else  {
      return  CANCERS.SUBCANCER + (Object.keys(this.cancer).length - 1);
    }
  }

  processResponse(json: any) {
    this.parentCancers  = json.parentCancers;
    this.subCancers = json.subCancers;
    this.regimenDetails = json.regimenDetails;

    this.currentCancer = json.currentCancer;
  }


}
