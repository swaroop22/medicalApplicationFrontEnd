import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-deleteregimen',
  templateUrl: './deleteregimen.component.html',
  styleUrls: ['./deleteregimen.component.scss']
})
export class DeleteregimenComponent {
  @Output() yes = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() RegimenDetail: any;

  constructor() {
  }

  okay() {
    this.yes.emit(this.RegimenDetail);
  }

  close(event) {
    this.cancel.emit(event);
  }

}
