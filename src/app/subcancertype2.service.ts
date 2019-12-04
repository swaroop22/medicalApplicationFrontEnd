import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/internal/Observable';
import { map } from "rxjs/operators";
import {environment} from '../environments/environment.prod';

@Injectable()
export class Subcancertype2Service {

  private ApiUrl = environment.apiEndPoint + 'subCancerType2ControllerById';

  constructor(private http: Http) {
  }

  getAllSubCancerTypes2(): Observable<any> {
    return this.http.get(this.ApiUrl).pipe(map( response => {
      return response.json();
    }))
    onerror: ( (error) => {
      return error;
    })

  }

  getSubCancerTypes2(id: number): Observable<any> {
    var url = this.ApiUrl + "/" + id.toString();
    return this.http.get(url).pipe(map( response => {
      return response.json();
    }))
    onerror: ( (error) => {
      return error;
    })

  }

  addSubCancerTypes2(obj): Observable<any> {
    var url = this.ApiUrl + '/add';
    return this.http.post(url, obj).pipe(map( response => {
      return response.json();
    }))
    onerror: ( (error) => {
      return error;
    })
  }

  editSubCancerTypes2(obj): Observable<any> {
    var url = this.ApiUrl + '/edit';
    return this.http.put(url, obj).pipe(map( response => {
      return response.json();
    }))
    onerror: ( (error) => {
      return error;
    })
  }

  deleteSubCancerTypes2(id: number): Observable<any> {
    return this.http.delete(this.ApiUrl + '/' + id).pipe(map( response => {
      return response.json();
    }))
    onerror: ( (error) => {
      return error;
    })
  }

}
