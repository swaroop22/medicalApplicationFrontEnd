import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-deletesubcancertypes',
  templateUrl: './deletesubcancertypes.component.html',
  styleUrls: ['./deletesubcancertypes.component.scss']
})
export class DeletesubcancertypesComponent {
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
