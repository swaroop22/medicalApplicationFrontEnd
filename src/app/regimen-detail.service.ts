import {EventEmitter, Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/internal/Observable';
import { map } from "rxjs/operators";
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../environments/environment.prod';
import {Level, RegimenDetail} from './models/regimen-detail';


@Injectable()
export class RegimenDetailService {

  private ApiUrl = environment.apiEndPoint + 'regimenDetailController';
  public displayLevelType: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: Http,
              private route: ActivatedRoute) {
  }

  getRegimenDetails(id: number): Observable<any> {
    var url = this.ApiUrl + "/" + id.toString() +'/names';
    return this.http.get(url).pipe(map(response => {
      return response.json();
    }));

  }

  getRegimenLevelTypes(): Observable<any> {
    var url = this.ApiUrl + "/levels/REGIMEN";
    return this.http.get(url).pipe(map(response => {
      return response.json();
    }));

  }


  addRegimenLevel(level): Observable<any> {
    const obj = {
      type: 'REGIMEN',
      level: level
    };
    var url = this.ApiUrl + '/add/level';
    return this.http.post(url, obj).pipe(map( response => {
      return response.json();
    }));
  }

  addRegimenDetail(obj): Observable<any> {
    const idFromUrl = Number(this.route.children[0].snapshot.params["id"]);
    if(idFromUrl && idFromUrl !== 0)
    {
      obj.subCancerTypeId3 = Number(this.route.children[0].snapshot.params["id"]);
    }
    var url = this.ApiUrl + '/add';
    return this.http.post(url, obj)
      .pipe(map( response => {
      return response.json();
    }));
  }

  addRegimenDetailWithSubCancerType(obj): Observable<any> {
    //obj.subCancerTypeId3 = Number(this.route.children[0].snapshot.params["id"]);
    var url = this.ApiUrl + '/add';
    return this.http.post(url, obj).pipe(map( response => {
      return response.json();
    }));
  }

  updateRegimenDetail(obj): Observable<any> {
    return this.http.put(this.ApiUrl + '/updateRegimen', obj).pipe(map( response => {
      return response.json();
    }));
  }

  updateRegimenDetailWithCancerId(obj, cancerId): Observable<any> {
    return this.http.put(this.ApiUrl + `/updateRegimen/cancerId/${cancerId}`, obj).pipe(map( response => {
      return response.json();
    }, (error) => {
      return error;
    }));
  }

  updateCancerWithRegimen(regimenCancerLinks: [{regimenId, cancerId}]): Observable<any> {
    return this.http.put(this.ApiUrl + `linkRegimenToCancer`, regimenCancerLinks).pipe(map( response => {
      return {};
    }, (error) => {
      return error;
    }));
  }

  deleteRegimenFromCancer(regimenCancerLinks: [{regimenId, cancerId}]): Observable<any> {
    return this.http.put(this.ApiUrl + `deleteRegimenFromCancer`, regimenCancerLinks)
      .pipe(map( response => {
      return {};
    }, (error) => {
      return error;
    }));
  }

  deleteRegimenDetail(id: number): Observable<any> {
    return this.http.delete(this.ApiUrl + '/' + id).pipe(map( response => {
      return response.json();
    }))
  }

  displayLevelTypeModal() {
    this.displayLevelType.emit(true);
  }

  deleteLevel(regimenLevel: Level[]) {
    return this.http.post(this.ApiUrl + '/delete/level', regimenLevel).pipe(map( response => {
      return response;
    }))
  }

  editLevel(regimenLevel: Level[]) {
    return this.http.post(this.ApiUrl + '/edit/level', regimenLevel).pipe(map( response => {
      return response;
    }))
  }

  getRegimenListToAddToCancer(cancerId, type): Observable<any> {

    return this.http.get(this.ApiUrl + `/getRegimenListToAddToCancer/${cancerId}` + (type ? `/type/${type}` : ''))
      .pipe(map( response => {
      return response.json();
    }))
  }
}
