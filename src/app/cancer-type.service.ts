import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/internal/Observable';
import { map } from "rxjs/operators";
import {CANCERS} from './constants/constants';
import {CancerTreeService} from './services/cancer-tree.service';

@Injectable()
export class CancerTypeService {
  private apiEndPointsMap: Map<string, string> = new Map();
  private patientId;
  private cancerTypeId;
  private subCancer1Id;
  private subCancer2Id;
  private linkedId;
  private regimenId;
  constructor(private http: Http,
              private cancerTree: CancerTreeService) {
    this.apiEndPointsMap.set(CANCERS.PATIENT, 'http://localhost:8092/patientController');
    this.apiEndPointsMap.set(CANCERS.CANCER, 'http://localhost:8092/cancerTypeControllerById');
    this.apiEndPointsMap.set(CANCERS.SUBCANCER1, 'http://localhost:8092/subCancerType1ControllerById');
    this.apiEndPointsMap.set(CANCERS.SUBCANCER2, 'http://localhost:8092/subCancerType2ControllerById');
    this.apiEndPointsMap.set(CANCERS.SUBCANCER, 'http://localhost:8092/subCancerType3ControllerById');
    this.apiEndPointsMap.set(CANCERS.REGIMEN_DETAILS, 'http://localhost:8092/regimenDetailController');
  }

  getCancerTypes(id: number): Observable<any> {
    this.addId(id);
    const type = this.cancerTree.nextItemToFetch();
    let url = type === CANCERS.PATIENT ? `${this.apiEndPointsMap.get(type)}`: ( type === CANCERS.REGIMEN_DETAILS ? `${this.apiEndPointsMap.get(type)}/${id}/names` : this.getURL(id));
    return this.http.get(url).pipe(map( response => {
      this.cancerTree.addItem(response.json());
      return response.json();
    }));
  }

  getURL(cancerId?) {
    const fetchingItem = this.cancerTree.nextItemToFetch();
   if (fetchingItem === CANCERS.SUBCANCER1) {
      return this.apiEndPointsMap.get(CANCERS.SUBCANCER1) + `/${this.patientId}/${this.cancerTypeId}`;
    } else if (fetchingItem === CANCERS.SUBCANCER2) {
      return  this.apiEndPointsMap.get(CANCERS.SUBCANCER2) + `/${this.patientId}/${this.cancerTypeId}/${this.subCancer1Id}`;
    } else if(fetchingItem === CANCERS.SUBCANCER) {
     return  this.apiEndPointsMap.get(CANCERS.SUBCANCER) + `/${this.patientId}/${this.cancerTypeId}/${this.subCancer1Id}/${this.subCancer2Id}`;
   } else if (fetchingItem === CANCERS.CANCER) {
      return this.apiEndPointsMap.get(CANCERS.CANCER) + `/${cancerId}`;
    }

  }

  addId(id) {
    if(!this.patientId) {
      this.patientId = id;
    }
    else if(!this.cancerTypeId) {
      this.cancerTypeId = id;
    }
    else if(!this.subCancer1Id) {
      this.subCancer1Id = id;
    }
    else if(!this.subCancer2Id) {
      this.subCancer2Id = id;
    }
    else if(!this.linkedId) {
      this.linkedId = id;
    }
  }

  addCancerTypes(obj, type): Observable<any> {
    const url = `${this.apiEndPointsMap.get(CANCERS.SUBCANCER)}/add`;
    return this.http.post(url, obj).pipe(map( response => {
      return response.json();
    }));
  }

  editCancerTypes(obj, type): Observable<any> {
    const url = `${this.apiEndPointsMap.get(type)}/edit`;
    return this.http.put(url, obj).pipe(map( response => {
      return response.json();
    }));
  }

  deleteCancerTypes(id: number, type): Observable<any> {
    return this.http.delete(`${this.apiEndPointsMap.get(type)}`).pipe(map( response => {
      return response.json();
    }));
  }

}
