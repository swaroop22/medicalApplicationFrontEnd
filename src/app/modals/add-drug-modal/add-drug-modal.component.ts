import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Drug} from '../../models/regimen-detail';

@Component({
  selector: 'app-add-drug-modal',
  templateUrl: './add-drug-modal.component.html',
  styleUrls: ['./add-drug-modal.component.css']
})
export class AddDrugModalComponent implements OnInit {
  @Output() yes = new EventEmitter();
  @Output() cancel = new EventEmitter();
  newDrug: Drug = {
    drugBrandList: [],
    genericName: ''
  };
  constructor() { }

  ngOnInit(): void {
  }

  okay() {
    this.yes.emit(this.newDrug);
  }

  hideAddNewDrugModal() {
    this.cancel.emit();
  }
}
