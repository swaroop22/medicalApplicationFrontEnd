import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/internal/Observable';
import { map } from "rxjs/operators";
import {CANCERS} from './constants/constants';
import {CancerTreeService} from './services/cancer-tree.service';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {Breadcrumb} from 'primeng/primeng';

@Injectable()
export class CancerTypeService {
  private apiEndPointsMap: Map<string, string> = new Map();
  private patientId;
  cancerTypeId;
  private subCancer1Id;
  private subCancer2Id;
  private linkedId;
  private linkedIds = [];
  private breadCrumbs = [];
  public regimenId;
  constructor(private http: Http,
              private route: ActivatedRoute,
              private router: Router,
              private cancerTree: CancerTreeService) {
    this.apiEndPointsMap.set(CANCERS.PATIENT, 'http://localhost:8092/patientController');
    this.apiEndPointsMap.set(CANCERS.CANCER, 'http://localhost:8092/getCancersByPatient');
    this.apiEndPointsMap.set(CANCERS.CANCER_ADD, 'http://localhost:8092/cancerTypeControllerById/add');
    this.apiEndPointsMap.set(CANCERS.CANCER_DELETE, 'http://localhost:8092//cancerTypeControllerById/');
    this.apiEndPointsMap.set(CANCERS.CANCER_EDIT, 'http://localhost:8092//cancerTypeControllerById/edit');
    this.apiEndPointsMap.set(CANCERS.SUBCANCER1, 'http://localhost:8092/getCancersByParentId');
    this.apiEndPointsMap.set(CANCERS.REGIMEN_DETAILS, 'http://localhost:8092/regimenDetailController');
  }

  getCancerById(typeToFetch?): Observable<any> {

    let url = this.getURL();

    return this.http.get(url).pipe(map( response => {
      // this.cancerTree.addItem(response.json(), type);
      // if(type !== CANCERS.REGIMEN_DETAILS) {
      //   const id = this.cancerTree.getCurrentLevel();
      //
      //   let breadCrumbPresent = false;
      //   this.breadCrumbs.forEach(breadCrumb => {
      //     if(breadCrumb.label === id) {
      //       breadCrumbPresent = true;
      //     }
      //   });
      //
      //   if(!breadCrumbPresent) {
      //     this.breadCrumbs.push({label: id, styleClass: 'ui-breadcrumb', command: (event) => {
      //
      //       }});
      //   }
      //
      // }

      this.cancerTree.processResponse(response.json());
      return response.json();
    }));
  }

  getPatients() {
    return this.http.get(this.apiEndPointsMap.get(CANCERS.PATIENT)).pipe(map( response => {
      return response.json();
    }));
  }

  getRegimenById(id?) {
    return this.http.get(`${this.apiEndPointsMap.get(CANCERS.REGIMEN_DETAILS)}/${id || 0}/names`).pipe(map( response => {
      return response.json();
    }));
  }

  getURL() {
    const patientId = this.route.children[0].snapshot.params["patientId"];
    const cancerId = this.route.children[0].snapshot.params["cancerId"];

    if(!cancerId) {
     return this.apiEndPointsMap.get(CANCERS.CANCER) + `/${patientId}`;
    } else {
      return this.apiEndPointsMap.get(CANCERS.SUBCANCER1) + `/${cancerId}`;
    }
  }

  getAllCancerTypes() : Observable<any>{
    return this.http.get(this.apiEndPointsMap.get(CANCERS.CANCER)).pipe(map( response => {
      return response.json();
    }));
  }

  addCancerTypes(obj): Observable<any> {
    const patientId = this.route.children[0].snapshot.params["patientId"];
    const cancerId = this.route.children[0].snapshot.params["cancerId"];

    const payload = {
      patientType: patientId,
      parentId: cancerId,
      title: obj.title
    };

    const url = this.apiEndPointsMap.get(CANCERS.CANCER_ADD);
    return this.http.post(url, payload).pipe(map( response => {
      return response.json();
    }));
  }

  editCancerTypes(obj): Observable<any> {
    const url = this.apiEndPointsMap.get(CANCERS.CANCER_EDIT);
    return this.http.post(url, obj).pipe(map( response => {
      return response.json();
    }));
  }

  deleteCancerTypes(id: number, type): Observable<any> {
    return this.http.delete(`${this.apiEndPointsMap.get(CANCERS.CANCER_DELETE)}/${id}`).pipe(map( response => {
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
     if(url === 'cancerTypes/') {
       url = 'patientTypes'
     }

     return url;
  }



  getBreadCrumbData() {
    return this.breadCrumbs;
  }

  setBreadCrumbData(data: any[]) {
    this.breadCrumbs = data;
  }
}
