import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-deletecancertypes',
  templateUrl: './deletecancertypes.component.html',
  styleUrls: ['./deletecancertypes.component.scss']
})
export class DeletecancertypesComponent {
  @Output() yes = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() CancerType: any;

  constructor() {
  }

  okay() {
    this.yes.emit(this.CancerType);
  }

  close(event) {
    this.cancel.emit(event);
  }

}
