import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Http} from '@angular/http';
import * as sha1 from "crypto-js/sha1";
import {environment} from '../../environments/environment.prod';

@Injectable()
export class UserService {
  constructor(private http: Http) {
    this.userNameMap.set('oncamigo', 'oncamigo1');
    this.userNameMap.set('operator1', 'oncamigo1');
    this.userNameMap.set('operator2', 'oncamigo1');
    this.userNameMap.set('operator3', 'oncamigo1');
  }

  userNameMap: Map<string, string> = new Map();
  isLoggedIn: boolean;

  login(loginForm) {

    const userName = loginForm.username;
    const password = loginForm.password;

    if(this.userNameMap.get(userName) && this.userNameMap.get(userName) === password) {
      this.isLoggedIn = true;
      return true;
    }

    return false;
    // const passwordHash = sha1(loginForm.password, loginForm.username);
    // const bta = btoa(passwordHash);
    // return this.http.post(environment.apiEndPoint +  "/login", {userName: loginForm.username, password: bta}).pipe(map( response => {
    //   if(response.json().success) {
    //     this.isLoggedIn = true;
    //    return true;
    //   } else {
    //     this.isLoggedIn = true;
    //     return false;
    //   }
    // }));
  }

  logout() {
    this.isLoggedIn = false;
  }

  signUp(signUpForm) {
    const passwordHash = sha1(signUpForm.password, signUpForm.username);
    const btaPassword = btoa(passwordHash);
    signUpForm.password = btaPassword;

    return this.http.post(environment.apiEndPoint +  "/signup", signUpForm).pipe(map( response => {
      if(response.json().success) {
        this.isLoggedIn = true;
        return true;
      } else {
        this.isLoggedIn = true;
        return false;
      }
    }));

  }

  resetPassword(resetPasswordForm) {
    const passwordHash = sha1(resetPasswordForm.password, resetPasswordForm.username);
    const btaPassword = btoa(passwordHash);

    return this.http.post(environment.apiEndPoint +  "/resetPassword", {userName: resetPasswordForm.username, password: btaPassword}).pipe(map( response => {
      if(response.json().success) {
        return true;
      } else {
        return false;
      }
    }));

  }

  performActionOnUser(userName, action) {

    return this.http.get(`${environment.apiEndPoint}/action/${action}/user/${userName}`).pipe(map( response => {
      if(response.json().success) {
        return true;
      } else {
        return false;
      }
    }));
  }
}
