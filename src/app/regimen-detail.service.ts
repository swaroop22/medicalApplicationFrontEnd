import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/internal/Observable';
import { map } from "rxjs/operators";
import {ActivatedRoute, Router} from '@angular/router';


@Injectable()
export class RegimenDetailService {

  private ApiUrl = 'http://localhost:8092/regimenDetailController';

  constructor(private http: Http,
              private route: ActivatedRoute) {
  }

  getRegimenDetails(id: number): Observable<any> {
    var url = this.ApiUrl + "/" + id.toString() +'/names';
    return this.http.get(url).pipe(map(response => {
      return response.json();
    }))
    onerror: ((error) => {
      return error;
    })

  }

  getRegimenLevelTypes(): Observable<any> {
    var url = this.ApiUrl + "/levels/REGIMEN";
    return this.http.get(url).pipe(map(response => {
      return response.json();
    }))
    onerror: ((error) => {
      return error;
    })

  }


  addRegimenLevel(level): Observable<any> {
    const obj = {
      type: 'REGIMEN',
      level: level
    };
    var url = this.ApiUrl + '/add/level';
    return this.http.post(url, obj).pipe(map( response => {
      return response.json();
    }))
    onerror: ( (error) => {
      return error;
    })

  }

  addRegimenDetail(obj): Observable<any> {
    obj.subCancerTypeId3 = Number(this.route.children[0].snapshot.params["id"]);
    var url = this.ApiUrl + '/add';
    return this.http.post(url, obj).pipe(map( response => {
      return response.json();
    }))
    onerror: ( (error) => {
      return error;
    })
  }

  addRegimenDetailWithSubCancerType(obj): Observable<any> {
    //obj.subCancerTypeId3 = Number(this.route.children[0].snapshot.params["id"]);
    var url = this.ApiUrl + '/add';
    return this.http.post(url, obj).pipe(map( response => {
      return response.json();
    }))
    onerror: ( (error) => {
      return error;
    })
  }

  updateRegimenDetail(obj): Observable<any> {
    return this.http.put(this.ApiUrl + '/' + obj.id, obj).pipe(map( response => {
      return response.json();
    }))
    onerror: ( (error) => {
      return error;
    })
  }

  deleteRegimenDetail(id: number): Observable<any> {
    return this.http.delete(this.ApiUrl + '/' + id).pipe(map( response => {
      return response.json();
    }))
    onerror: ( (error) => {
      return error;
    })
  }


}
