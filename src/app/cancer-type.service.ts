import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/internal/Observable';
import { map } from "rxjs/operators";
import {CANCERS} from './constants/constants';
import {CancerTreeService} from './services/cancer-tree.service';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {Breadcrumb, MenuItem} from 'primeng/primeng';
import {CancerResponse} from './state/CancerResponse';
import {of} from 'rxjs';
import {CancerType} from './state/CancerType';
import {environment} from '../environments/environment.prod';

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
    this.apiEndPointsMap.set(CANCERS.PATIENT, environment.apiEndPoint + 'patientController');
    this.apiEndPointsMap.set(CANCERS.CANCER, environment.apiEndPoint + 'getCancersByPatient');
    this.apiEndPointsMap.set(CANCERS.CANCER_ADD, environment.apiEndPoint + 'cancerTypeControllerById/add');
    this.apiEndPointsMap.set(CANCERS.CANCER_DELETE, environment.apiEndPoint + 'cancerTypeControllerById/');
    this.apiEndPointsMap.set(CANCERS.CANCER_EDIT, environment.apiEndPoint + 'cancerTypeControllerById/edit');
    this.apiEndPointsMap.set(CANCERS.SUBCANCER1, environment.apiEndPoint + 'getCancersByParentId');
    this.apiEndPointsMap.set(CANCERS.REGIMEN_DETAILS, environment.apiEndPoint + 'regimenDetailController');
    this.getAllCancerNames().subscribe(cancers => {});
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

  getAllCancerNames() {
    if(this.cancerTree.allCancers.length > 0) {
      return of(this.cancerTree.allCancers);
    }

    return this.http.get(`${environment.apiEndPoint}getAllCancerNames`).pipe(map( response => {
      let cancerList = [];
      (response.json().allCancers || []).forEach(cancer => {

        if (cancer && cancer.length >= 1) {
          const cancerType: CancerType = new CancerType();
          cancerType.title = cancer[1];
          cancerType.id = cancer[0];
          cancerList.push({
            label: cancerType.title,
            value: cancerType
          })

        }
      });

      this.cancerTree.allCancers = cancerList;

      return cancerList;
    }));
  }

  getRegimenByIdAndType(id?, type?) {
    return this.http.get(`${this.apiEndPointsMap.get(CANCERS.REGIMEN_DETAILS)}/${id || 0}/type/${type}`).pipe(map( response => {
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
      patientType: obj.patientId || patientId,
      parentId: obj.parentId || cancerId,
      title: obj.title,
      subCancerType: obj.subCancerType
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


  getBreadCrumbData(response?: CancerResponse) {
    const crumbs: MenuItem[] = [];

    crumbs.push({
      label: 'HOME', styleClass: 'ui-breadcrumb', command: (event) => {
        this.router.navigateByUrl('patientTypes');
      }
    });

    if(response && response.patientType) {
      crumbs.push({
        label: response.patientTitle, styleClass: 'ui-breadcrumb', command: (event) => {
          //this.router.navigateByUrl('patientTypes/' + response.patientType );
          this.router.navigateByUrl('patientTypes');
        }
      });
    }

    if (response && response.parentCancers) {


      for(let i=0; i< response.parentCancers.length; i++) {
        if (i === 0) {
          crumbs.push({
            label: response.parentCancers[i].title, styleClass: 'ui-breadcrumb', command: (event) => {
              this.router.navigateByUrl('cancerTypes/' + response.patientType);
            }
          });
        } else {
          crumbs.push({
            label: response.parentCancers[i].title, styleClass: 'ui-breadcrumb', command: (event) => {
              this.router.navigateByUrl('subCancers/' + response.parentCancers[i-1].id);
            }
          });

        }
      }

    }


    return crumbs;
  }

  setBreadCrumbData(data: any[]) {
    this.breadCrumbs = data;
  }
}
