import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-editpatienttypes',
  templateUrl: './editpatienttypes.component.html',
  styleUrls: ['./editpatienttypes.component.scss']
})
export class EditpatienttypesComponent{
  @Output() yes = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() PatientType: any;
  constructor() {
  }

  okay() {
    this.yes.emit(this.PatientType);
  }

  close(event) {
    this.cancel.emit(event);
  }

}
