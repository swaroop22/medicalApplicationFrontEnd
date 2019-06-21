import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/internal/Observable';
import { map } from "rxjs/operators";



@Injectable()
export class CancerTypeService {
  private ApiUrl = 'http://localhost:8092/cancerTypeControllerById';

  constructor(private http: Http) {
  }

  getCancerTypes( id: number): Observable<any> {
    var url = this.ApiUrl + "/" + id.toString();
    return this.http.get(url).pipe(map( response => {
      return response.json();
    }))
    onerror: ( (error) => {
      return error;
    })

  }

  addCancerTypes(obj): Observable<any> {

    var url = this.ApiUrl + '/' + 'add';
    return this.http.post(url, obj).pipe(map( response => {
      return response.json();
    }))
    onerror: ( (error) => {
      return error;
    })
  }

  editCancerTypes(obj): Observable<any> {

    var url = this.ApiUrl + '/' + 'edit';
    return this.http.put(url, obj).pipe(map( response => {
      return response.json();
    }))
    onerror: ( (error) => {
      return error;
    })
  }

  deleteCancerTypes(id: number): Observable<any> {
    return this.http.delete(this.ApiUrl + '/' + id).pipe(map( response => {
      return response.json();
    }))
    onerror: ( (error) => {
      return error;
    })
  }

}
