import { Component } from '@angular/core';
import {RegimenDetailService} from './regimen-detail.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  displayLevelModal: boolean;
  constructor(private regimeDetailService: RegimenDetailService) {
    regimeDetailService.displayLevelType.subscribe(display => {
        this.displayLevelModal = display;
    })
  }
}
