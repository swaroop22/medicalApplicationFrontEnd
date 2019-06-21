import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-deletepatienttypes',
  templateUrl: './deletepatienttypes.component.html',
  styleUrls: ['./deletepatienttypes.component.scss']
})
export class DeletepatienttypesComponent {
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
