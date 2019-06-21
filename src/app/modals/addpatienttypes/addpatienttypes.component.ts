import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-addpatienttypes',
  templateUrl: './addpatienttypes.component.html',
  styleUrls: ['./addpatienttypes.component.scss']
})
export class AddpatienttypesComponent implements OnChanges {

  @Output() yes = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() Error: any;

  public PatientType = {
    title: ''
  };

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.Error.currentValue.login) {
      this.initEmptyUser();
    }
  }

  initEmptyUser() {
    const PatientType = {
      title: ''
    };
    this.PatientType = JSON.parse(JSON.stringify(PatientType));
  }

  okay() {
    this.yes.emit(this.PatientType);
  }

  close(event) {
    this.cancel.emit(event);
  }

}
