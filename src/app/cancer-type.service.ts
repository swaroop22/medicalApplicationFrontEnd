import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/internal/Observable';
import { map } from "rxjs/operators";
import {CANCERS} from './constants/constants';
import {CancerTreeService} from './services/cancer-tree.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Breadcrumb} from 'primeng/primeng';

@Injectable()
export class CancerTypeService {
  private apiEndPointsMap: Map<string, string> = new Map();
  private patientId;
  private cancerTypeId;
  private subCancer1Id;
  private subCancer2Id;
  private linkedId;
  public regimenId;
  constructor(private http: Http,
              private route: ActivatedRoute,
              private cancerTree: CancerTreeService) {
    this.apiEndPointsMap.set(CANCERS.PATIENT, 'http://localhost:8092/patientController');
    this.apiEndPointsMap.set(CANCERS.CANCER, 'http://localhost:8092/cancerTypeControllerById');
    this.apiEndPointsMap.set(CANCERS.SUBCANCER1, 'http://localhost:8092/subCancerType1ControllerById');
    this.apiEndPointsMap.set(CANCERS.SUBCANCER2, 'http://localhost:8092/subCancerType2ControllerById');
    this.apiEndPointsMap.set(CANCERS.SUBCANCER, 'http://localhost:8092/subCancerType3ControllerById');
    this.apiEndPointsMap.set(CANCERS.REGIMEN_DETAILS, 'http://localhost:8092/regimenDetailController');
  }

  getCancerTypes(): Observable<any> {
    this.getDataFromRoute();
    const type = this.cancerTree.nextItemToFetch();
    let url = type === CANCERS.PATIENT ? `${this.apiEndPointsMap.get(type)}`: ( type === CANCERS.REGIMEN_DETAILS ? `${this.apiEndPointsMap.get(type)}/${this.regimenId}/names` : this.getURL());

    if(type === CANCERS.SUBCANCER) {
      const payload = {
        patienttypeid: this.patientId,
        cancerTypeId: this.cancerTypeId,
        subcancertype1id: this.subCancer1Id,
        subcancertype2id: this.subCancer2Id,
        linkedSubCancerId: this.linkedId,
      };
      return this.http.post(url, payload).pipe(map( response => {
        this.cancerTree.addItem(response.json(), type);
        return response.json();
      }));
    }
    else {
      return this.http.get(url).pipe(map( response => {
        this.cancerTree.addItem(response.json(), type);
        return response.json();
      }));
    }
  }

  getURL() {
    const fetchingItem = this.cancerTree.nextItemToFetch();
   if (fetchingItem === CANCERS.SUBCANCER1) {
      return this.apiEndPointsMap.get(CANCERS.SUBCANCER1) + `/${this.patientId}/${this.cancerTypeId}`;
    } else if (fetchingItem === CANCERS.SUBCANCER2) {
      return  this.apiEndPointsMap.get(CANCERS.SUBCANCER2) + `/${this.patientId}/${this.cancerTypeId}/${this.subCancer1Id}`;
    } else if(fetchingItem === CANCERS.SUBCANCER) {
     return  this.apiEndPointsMap.get(CANCERS.SUBCANCER) + '/get';
   } else if (fetchingItem === CANCERS.CANCER) {
      return this.apiEndPointsMap.get(CANCERS.CANCER) + `/${this.patientId}`;
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
    const payload = {
      patienttypeid: this.patientId,
      cancerTypeId: this.cancerTypeId,
      subcancertype1id: this.subCancer1Id,
      subcancertype2id: this.subCancer2Id,
      linkedSubCancerId: this.linkedId,
      title: obj.title
    };

    const url = `${this.apiEndPointsMap.get(CANCERS.SUBCANCER)}/add`;
    return this.http.post(url, payload).pipe(map( response => {
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

  getNextUrl() {
    let url = 'cancerTypes/';
    if(this.patientId) {
      url = url + this.patientId;
    }

     if(this.cancerTypeId) {
       url = url + '/' + this.cancerTypeId;
    }
     if(this.subCancer1Id) {
       url = url + '/' +  this.subCancer1Id;
    }
     if(this.subCancer2Id) {
       url = url + '/' + this.subCancer2Id;
    }
     if(this.linkedId) {
       url = url + '/' + this.linkedId;
    }

     return url;
  }

  getLatestItemAdded() {
    if (this.linkedId) {
      return this.linkedId;
    } else if (this.subCancer2Id) {
      return this.subCancer2Id;
    } else if (this.subCancer1Id) {
      return this.subCancer1Id;
    } else if (this.cancerTypeId) {
      return this.cancerTypeId;
    } else if (this.patientId) {
      return this.patientId;
    }
  }

  getDataFromRoute() {
    this.patientId = this.route.children[0].snapshot.params["patientId"];
    this.cancerTypeId = this.route.children[0].snapshot.params["cancerId"];
    this.subCancer1Id = this.route.children[0].snapshot.params["subCancerType1id"];
    this.subCancer2Id = this.route.children[0].snapshot.params["subCancerType2Id"];
    this.linkedId = this.route.children[0].snapshot.params["linkedId"];
  }

  getBreadCrumbData() {
    const crumbs = [];
    const keys = Object.keys(this.cancerTree.cancer) || [];
    keys.forEach((breadCrumb, index) => {
      let url = '';
      switch(breadCrumb) {
        case CANCERS.PATIENT:
          url = 'http://localhost:4200/patientTypes';
          break;
        case CANCERS.REGIMEN_DETAILS:
          break;
        case CANCERS.CANCER:
          url = `http://localhost:4200/cancerTypes/${this.patientId}`;
          break;
        case CANCERS.SUBCANCER1:
          url = `http://localhost:4200/cancerTypes/${this.patientId}/${this.cancerTypeId}`;
          break;
        case CANCERS.SUBCANCER2:
          url = `http://localhost:4200/cancerTypes/${this.patientId}/${this.cancerTypeId}/${this.subCancer1Id}`;
          break;
        case CANCERS.SUBCANCER:
          if(this.linkedId) {
            url = `http://localhost:4200/cancerTypes//${this.patientId}/${this.cancerTypeId}/${this.subCancer1Id}/${this.subCancer2Id}/${this.linkedId}`;
          } else{
            url = `http://localhost:4200/cancerTypes//${this.patientId}/${this.cancerTypeId}/${this.subCancer1Id}/${this.subCancer2Id}`
          }
          break;
      }

      crumbs.push(
        {label: breadCrumb, url: url, styleClass: 'ui-breadcrumb'},
      );
    });
    return crumbs;
  }
}
