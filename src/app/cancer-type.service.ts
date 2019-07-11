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
    this.apiEndPointsMap.set(CANCERS.CANCER, 'http://localhost:8092/cancerTypeControllerById');
    this.apiEndPointsMap.set(CANCERS.SUBCANCER1, 'http://localhost:8092/subCancerType1ControllerById');
    this.apiEndPointsMap.set(CANCERS.SUBCANCER2, 'http://localhost:8092/subCancerType2ControllerById');
    this.apiEndPointsMap.set(CANCERS.SUBCANCER, 'http://localhost:8092/subCancerType3ControllerById');
    this.apiEndPointsMap.set(CANCERS.REGIMEN_DETAILS, 'http://localhost:8092/regimenDetailController');
  }

  getCancerTypes(typeToFetch?): Observable<any> {
    this.getDataFromRoute();
    const type = this.cancerTree.nextItemToFetch();
    let url = type === CANCERS.PATIENT ? `${this.apiEndPointsMap.get(type)}`: ( type === CANCERS.REGIMEN_DETAILS ? `${this.apiEndPointsMap.get(type)}/${this.cancerTypeId || 0}/names` : this.getURL());

    const payload = {
      patienttypeid: this.patientId,
      cancerTypeId: this.cancerTypeId,
      subcancertype1id: this.subCancer1Id,
      subcancertype2id: this.subCancer2Id,
      linkedSubCancerId: this.linkedId,
    };

    if([CANCERS.PATIENT, CANCERS.CANCER, CANCERS.SUBCANCER1, CANCERS.SUBCANCER2, CANCERS.REGIMEN_DETAILS].indexOf(type) > -1 ) {
      return this.http.get(url).pipe(map( response => {
        this.cancerTree.addItem(response.json(), type);
        if(type !== CANCERS.REGIMEN_DETAILS) {
          const id = this.cancerTree.getCurrentLevel();

          let breadCrumbPresent = false;
          this.breadCrumbs.forEach(breadCrumb => {
            if(breadCrumb.label === id) {
              breadCrumbPresent = true;
            }
          });

          if(!breadCrumbPresent) {
            this.breadCrumbs.push({label: id, styleClass: 'ui-breadcrumb', command: (event) => {
                this.callAlert(event);
              }});
          }
          // this.breadCrumbs.push({label: id, url: url, styleClass: 'ui-breadcrumb'});

        }

        return response.json();
      }));
    }
    else {

      return this.http.post(url, payload).pipe(map( response => {
        // if(type === CANCERS.SUBCANCER1 || type === CANCERS.SUBCANCER2) {
        //
        // } else {
        //   this.cancerTree.addItem(response.json());
        //
        // }
        const id = CANCERS.SUBCANCER + (this.breadCrumbs.length - 1) + 'TYPE' ;

        if(response.json().length !== 0) {
          this.cancerTree.addItem(response.json(), id);

          const cl = this.cancerTree.getCurrentLevel();

          let breadCrumbPresent = false;
          this.breadCrumbs.forEach(breadCrumb => {
            if(breadCrumb.label === cl) {
              breadCrumbPresent = true;
            }
          });

          if(!breadCrumbPresent) {
            this.breadCrumbs.push({label: cl, styleClass: 'ui-breadcrumb', command: (event) => {
                this.callAlert(event);
              }});
          }
          // this.breadCrumbs.push({label: id, url: url, styleClass: 'ui-breadcrumb'});

        }

        return response.json();
      }));
    }
  }

  callAlert(event) {

    const level = event.item.label;

    const typeNumber = isNaN(level.charAt(9)) ? level.charAt(9) : Number(level.charAt(9));

    if(typeNumber === 3) {
      this.linkedIds = [];
    } else if (typeNumber > 3 ) {
      this.linkedIds = this.linkedIds.slice(0, (3 - this.linkedIds.length));
    } else if (typeNumber === 2) {
      this.linkedIds = [];
      this.linkedId = undefined;
    } else if (typeNumber === 1) {
      this.linkedIds = [];
      this.linkedId = undefined;
      this.subCancer2Id = undefined;
    } else if (typeNumber === 'E') {
      this.linkedIds = [];
      this.linkedId = undefined;
      this.subCancer2Id = undefined;
      this.subCancer1Id = undefined;
      this.cancerTypeId  = undefined;
    }  else if (typeNumber === 'P') {
      this.linkedIds = [];
      this.linkedId = undefined;
      this.subCancer2Id = undefined;
      this.subCancer1Id = undefined;
      this.cancerTypeId  = undefined;
      this.patientId = undefined;
    }

    this.refreshBreadCrumbs(level);
    this.cancerTree.clearTillLevel(level);


    this.router.navigateByUrl(this.getNextUrl())
  }

  refreshBreadCrumbs(level) {
    let breadCrumbToSliceId = 0;
    for(let i=0; i< this.breadCrumbs.length; i++) {
      // newBreadCrumbs.push(this.breadCrumbs[i]);
      if(this.breadCrumbs[i].label === level) {
        breadCrumbToSliceId = i;
      }
    }

    this.breadCrumbs = this.breadCrumbs.slice(0, breadCrumbToSliceId);
  }

  getURL() {
    const fetchingItem = this.cancerTree.nextItemToFetch();
   if (fetchingItem === CANCERS.SUBCANCER1) {
      return this.apiEndPointsMap.get(CANCERS.SUBCANCER1) + `/${this.patientId}/${this.cancerTypeId}`;
    } else if (fetchingItem === CANCERS.SUBCANCER2) {
      return  this.apiEndPointsMap.get(CANCERS.SUBCANCER2) + `/${this.patientId}/${this.cancerTypeId}/${this.subCancer1Id}`;
    } else if(fetchingItem === CANCERS.CANCER) {
     return this.apiEndPointsMap.get(CANCERS.CANCER) + `/${this.patientId}`;
   } else {
     return  this.apiEndPointsMap.get(CANCERS.SUBCANCER) + '/get';
   }
  }

  getAllCancerTypes() : Observable<any>{
    return this.http.get(this.apiEndPointsMap.get(CANCERS.CANCER)).pipe(map( response => {
      return response.json();
    }));
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
    } else if(this.linkedId) {
      this.linkedIds.push(this.linkedId);
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
     if(url === 'cancerTypes/') {
       url = 'patientTypes'
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
    this.patientId = this.patientId ? this.patientId: this.route.children[0].snapshot.params['patientId'];
    this.cancerTypeId = this.cancerTypeId ? this.cancerTypeId : this.route.children[0].snapshot.params['cancerId'];
    this.subCancer1Id = this.subCancer1Id ? this.subCancer1Id : this.route.children[0].snapshot.params['subCancerType1id'];
    this.subCancer2Id = this.subCancer2Id ? this.subCancer2Id : this.route.children[0].snapshot.params['subCancerType2Id'];

    if (!this.linkedId) {
      this.linkedId = this.route.children[0].snapshot.params['linkedId'];
    } else {
      if (this.linkedIds.indexOf(this.linkedId) === -1) {
        this.linkedIds.push(this.linkedId);
      }
      this.linkedId = this.route.children[0].snapshot.params['linkedId'];
    }

  }

  getBreadCrumbData() {
    return this.breadCrumbs;
  }

  setBreadCrumbData(data: any[]) {
    this.breadCrumbs = data;
  }

  getBreadCrumbUrl(payLoad) {

    let url = '';

    url = 'patientTypes';

    if (payLoad.patienttypeid) {
      url = `cancerTypes/${payLoad.patienttypeid}`;

    }

    if (payLoad.cancerTypeId) {
      url = `cancerTypes/${payLoad.patienttypeid}/${payLoad.cancerTypeId}`;

    }

    if (payLoad.subcancertype1id) {
      url = `cancerTypes/${payLoad.patienttypeid}/${payLoad.cancerTypeId}/${payLoad.subcancertype1id}`;

    }

    if (payLoad.subcancertype2id) {
      url = `cancerTypes/${payLoad.patienttypeid}/${payLoad.cancerTypeId}/${payLoad.subcancertype1id}/${payLoad.subcancertype2id}`;
    }


    if (payLoad.linkedSubCancerId) {
      url = `cancerTypes/${payLoad.patienttypeid}/${payLoad.cancerTypeId}/${payLoad.subcancertype1id}/${payLoad.subcancertype2id}/${payLoad.linkedSubCancerId}`;
    }

    return url;
  }
}
