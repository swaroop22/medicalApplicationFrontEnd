import {Injectable} from '@angular/core';
import {PatientType} from '../state/PatientType';
import {CANCERS} from '../constants/constants';
import {CancerType} from '../state/CancerType';
import {createForJitStub} from '@angular/compiler/src/aot/summary_serializer';
import {Router} from '@angular/router';

@Injectable()
export class  CancerTreeService {
  cancer: any = {};

  constructor(private router: Router) {}

  addItem(json: any, type) {
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
        this.addSubCancer(json);
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

  addSubCancer(subCancers: CancerType[]) {
    if(subCancers.length > 0) {
      this.cancer[this.getNextItemName()] = subCancers;
    }
  }

  clearCurrentLevel() {
    delete this.cancer[this.getCurrentLevel()];
  }

  getCurrentLevel() {
    return Object.keys(this.cancer)[Object.keys(this.cancer).length -1];
  }

  getNextItemName() {
    const newSubCancerLevel = Object.keys(this.cancer).length - 1; // removing the patient and cancer types

    return CANCERS.SUBCANCER + newSubCancerLevel + 'TYPE'
    //
    // let currentLevel: string = this.nextItemToFetch();
    //
    // if(currentLevel === CANCERS.SUBCANCER && currentLevel != CANCERS.SUBCANCER1 && currentLevel != CANCERS.SUBCANCER2) {
    //   currentLevel = CANCERS.SUBCANCER + (Object.keys(this.cancer).length - 1);
    // }
    //
    // return currentLevel;
  }

  nextItemToFetch() {
    const currentLevel = this.getCurrentLevel();
    if(this.router.url.indexOf('regime') >= 0) {
      return CANCERS.REGIMEN_DETAILS;
    }
    else if (!this.cancer.hasOwnProperty(CANCERS.PATIENT)) {
      return CANCERS.PATIENT;
    } else if (!this.cancer.hasOwnProperty(CANCERS.CANCER)) {
      return CANCERS.CANCER;
    } else if (!this.cancer.hasOwnProperty(CANCERS.SUBCANCER1)) {
      return CANCERS.SUBCANCER1;
    } else if (!this.cancer.hasOwnProperty(CANCERS.SUBCANCER2)) {
      return CANCERS.SUBCANCER2;
    } else if (Object.keys(this.cancer).length >= 4 && !this.cancer.hasOwnProperty(CANCERS.REGIMEN_DETAILS) && this.cancer.hasOwnProperty(CANCERS.SUBCANCER2)) {
      return CANCERS.SUBCANCER;
    }
  }

  getBreadCrumbData() {
    const crumbs = [];
   const keys = Object.keys(this.cancer) || [];
  keys.forEach(breadCrumb => {
      crumbs.push(
        {label: breadCrumb, url: '', styleClass: 'ui-breadcrumb'},
      );
    });
    return crumbs;
  }
}
