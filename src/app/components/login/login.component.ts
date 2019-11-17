import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../services/UserService';

class UserOptions {
  username: string;
  password: string;
}

@Component({
  selector: 'f',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  login: UserOptions = { username: '', password: '' };
  submitted = false;
  message: string = 'Hello there!';
  form: FormGroup;

  constructor(
    private router: Router,
    private userService: UserService,
  ) {
    this.form = new FormGroup({
      username: new FormControl(),
      password: new FormControl()
    })
  }

  onLogin() {
    this.submitted = true;

    if (this.form.valid) {
      if(this.userService.login(this.form.value)){
        this.router.navigateByUrl("patientTypes")
      } else {
        this.message = 'Login Failed';
      }
    }
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }
}
