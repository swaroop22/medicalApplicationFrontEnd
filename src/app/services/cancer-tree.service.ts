import {Injectable} from '@angular/core';
import {PatientType} from '../state/PatientType';
import {CANCERS} from '../constants/constants';
import {CancerType} from '../state/CancerType';
import {createForJitStub} from '@angular/compiler/src/aot/summary_serializer';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class  CancerTreeService {
  cancer: any = {};

  constructor(private router: Router,
              private route: ActivatedRoute,) {}

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
    // const newSubCancerLevel = Object.keys(this.cancer).length - 1; // removing the patient and cancer types
    //
    // return CANCERS.SUBCANCER + newSubCancerLevel + 'TYPE'
    //
    let currentLevel: string = this.getCurrentLevel();

    if(currentLevel === CANCERS.SUBCANCER && currentLevel != CANCERS.SUBCANCER1 && currentLevel != CANCERS.SUBCANCER2) {
      currentLevel = CANCERS.SUBCANCER + (Object.keys(this.cancer).length - 1);
    } else if (currentLevel === CANCERS.PATIENT) {
      return CANCERS.CANCER
    }  else if (currentLevel === CANCERS.CANCER) {
      return CANCERS.SUBCANCER1
    }  else if (currentLevel === CANCERS.SUBCANCER1) {
      return CANCERS.SUBCANCER2
    }
    return currentLevel;
  }



  nextItemToFetch() {

    const data = this.getDataFromRoute();

    // const currentLevel = this.getCurrentLevel();
    if(this.router.url.indexOf('regime') >= 0) {
      return CANCERS.REGIMEN_DETAILS;
    }
    else if(data.linkedId) {
      return CANCERS.SUBCANCER;
    }
    else if(data.subCancer2Id) {
      return CANCERS.SUBCANCER;
    }
    else if(data.subCancer1Id) {
      return CANCERS.SUBCANCER2;
    }
    else if(data.cancerTypeId) {
      return CANCERS.SUBCANCER1;
    }
    else if(data.patientId) {
      return CANCERS.CANCER;
    } else {
      return CANCERS.PATIENT
    }


    // }
    // else if (!this.cancer.hasOwnProperty(CANCERS.PATIENT)) {
    //   return CANCERS.PATIENT;
    // } else if (!this.cancer.hasOwnProperty(CANCERS.CANCER)) {
    //   return CANCERS.CANCER;
    // } else if (!this.cancer.hasOwnProperty(CANCERS.SUBCANCER1)) {
    //   return CANCERS.SUBCANCER1;
    // } else if (!this.cancer.hasOwnProperty(CANCERS.SUBCANCER2)) {
    //   return CANCERS.SUBCANCER2;
    // } else if (Object.keys(this.cancer).length >= 4 && !this.cancer.hasOwnProperty(CANCERS.REGIMEN_DETAILS) && this.cancer.hasOwnProperty(CANCERS.SUBCANCER2)) {
    //   return CANCERS.SUBCANCER;
    // }
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
