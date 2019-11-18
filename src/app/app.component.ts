import { Component } from '@angular/core';
import {RegimenDetailService} from './regimen-detail.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: `<router-outlet></router-outlet><level-type [config]="{ show: true }" bsModal class="modal fade" *ngIf="displayLevelModal"></level-type>`
})
export class AppComponent {
  title = 'app';
  displayLevelModal: boolean;
  constructor(private regimeDetailService: RegimenDetailService) {
    regimeDetailService.displayLevelType.subscribe(display => {
      if(display)
        this.displayLevelModal = true;
      else
        this.displayLevelModal = false;
    })
  }
}
