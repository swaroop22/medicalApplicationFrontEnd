import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-editsubcancertypes',
  templateUrl: './editsubcancertypes.component.html',
  styleUrls: ['./editsubcancertypes.component.scss']
})
export class EditsubcancertypesComponent{
  @Output() yes = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() SubCancerType: any;
  constructor() {
  }

  okay() {
    this.yes.emit(this.SubCancerType);
  }

  close(event) {
    this.cancel.emit(event);
  }

}
