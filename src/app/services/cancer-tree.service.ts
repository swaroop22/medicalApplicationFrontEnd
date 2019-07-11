import {Injectable} from '@angular/core';
import {PatientType} from '../state/PatientType';
import {CANCERS} from '../constants/constants';
import {CancerType} from '../state/CancerType';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class  CancerTreeService {
  cancer: any = {};

  constructor(private router: Router,
              private route: ActivatedRoute,) {}

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
    return Object.keys(this.cancer)[Object.keys(this.cancer).length -1];
  }

  getNextItemName() {
    // const newSubCancerLevel = Object.keys(this.cancer).length - 1; // removing the patient and cancer types
    //
    // return CANCERS.SUBCANCER + newSubCancerLevel + 'TYPE'
    //
    let currentLevel: string = this.getCurrentLevel();

    if(Number(currentLevel.charAt(9)) > 2 || currentLevel === CANCERS.SUBCANCER2) {
      currentLevel = CANCERS.SUBCANCER + (Object.keys(this.cancer).length - 1) + 'TYPE';
    } else if (currentLevel === CANCERS.PATIENT) {
      return CANCERS.CANCER
    }  else if (currentLevel === CANCERS.CANCER) {
      return CANCERS.SUBCANCER1
    }  else if (currentLevel === CANCERS.SUBCANCER1) {
      return CANCERS.SUBCANCER2
    }
    return currentLevel;
  }

  clearTillLevel(levelId) {

    const keys = Object.keys(this.cancer);
    const index = keys.indexOf(levelId);
    const newCancerTree = {};

    for(let i=0; i< index; i++) {
      newCancerTree[keys[i]] = this.cancer[keys[i]];
    }

    this.cancer = newCancerTree;
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

  getDataFromRoute() {

    return {
    patientId : this.route.children[0].snapshot.params["patientId"],
    cancerTypeId : this.route.children[0].snapshot.params["cancerId"],
    subCancer1Id : this.route.children[0].snapshot.params["subCancerType1id"],
    subCancer2Id : this.route.children[0].snapshot.params["subCancerType2Id"],
    linkedId : this.route.children[0].snapshot.params["linkedId"]
    };

  }
}
