import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/internal/Observable';
import { map } from "rxjs/operators";

@Injectable()
export class Subcancertype3Service {
  private ApiUrl = 'http://localhost:8092/subCancerType3ControllerById';

  constructor(private http: Http) {
  }

  getAllSubCancerTypes3(): Observable<any> {
    return this.http.get(this.ApiUrl).pipe(map( response => {
      return response.json();
    }))
    onerror: ( (error) => {
      return error;
    })

  }

  getSubCancerTypes3(id: number): Observable<any> {
    var url = this.ApiUrl + "/" + id.toString();
    return this.http.get(url).pipe(map( response => {
      return response.json();
    }))
    onerror: ( (error) => {
      return error;
    })

  }

  addSubCancerTypes3(obj): Observable<any> {
    var url = this.ApiUrl + '/add';
    return this.http.post(url, obj).pipe(map( response => {
      return response.json();
    }))
    onerror: ( (error) => {
      return error;
    })
  }

  editSubCancerTypes3(obj): Observable<any> {
    var url = this.ApiUrl + '/edit';
    return this.http.put(url, obj).pipe(map( response => {
      return response.json();
    }))
    onerror: ( (error) => {
      return error;
    })
  }

  deleteSubCancerTypes3(id: number): Observable<any> {
    return this.http.delete(this.ApiUrl + '/' + id).pipe(map( response => {
      return response.json();
    }))
    onerror: ( (error) => {
      return error;
    })
  }

}
