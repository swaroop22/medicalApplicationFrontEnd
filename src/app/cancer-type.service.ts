import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/internal/Observable';
import { map } from "rxjs/operators";
import {CANCERS} from './constants/constants';
import {CancerTreeService} from './services/cancer-tree.service';

@Injectable()
export class CancerTypeService {
  private apiEndPointsMap: Map<string, string> = new Map();
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
    const type = this.cancerTree.nextItemToFetch();
    const url = type === CANCERS.PATIENT ? `${this.apiEndPointsMap.get(type)}`: ( type === CANCERS.REGIMEN_DETAILS ? `${this.apiEndPointsMap.get(type)}/${id}/names` : `${this.apiEndPointsMap.get(type)}/${id}`);
    return this.http.get(url).pipe(map( response => {
      this.cancerTree.addItem(response.json());
      return response.json();
    }));
  }

  addCancerTypes(obj, type): Observable<any> {
    const url = `${this.apiEndPointsMap.get(type)}/add`;
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
