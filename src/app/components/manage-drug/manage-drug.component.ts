import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {RegimenDetailService} from '../../regimen-detail.service';
import {Drug} from '../../models/regimen-detail';
import {FormControl} from '@angular/forms';
import {debounce} from 'rxjs/operators';
import {timer} from 'rxjs';

@Component({
  selector: 'app-manage-drug-modal',
  templateUrl: './manage-drug.component.html',
  styleUrls: ['./manage-drug.component.scss']
})
export class ManageDrugComponent implements OnInit {
  isLoading: boolean = false;
  @Output() cancel = new EventEmitter();
  drugList: Drug[] = [];
  drugListToDisplay: Drug[] = [];
  searchValue:FormControl = new FormControl('');
  displayAddNewBrandModal: boolean;


  constructor(private regimenDetailService: RegimenDetailService) { }

  ngOnInit(): void {

    this.getAllDrugs();

    this.searchValue.valueChanges.pipe(debounce(() => timer(300))).subscribe(value => {
      this.drugListToDisplay = this.drugList.filter(drug => {
        return (( drug.genericName || '').toUpperCase().indexOf(this.searchValue.value.toUpperCase()) > -1);
      })
    })
  }

  getAllDrugs() {
    this.isLoading = true;
    this.regimenDetailService.getAllDrugs().subscribe((drugs: Drug[]) => {
      this.drugList = drugs;
      this.isLoading = false;
    })
  }

  okay() {
    this.cancel.emit(true);
  }

  close(event?) {
    this.cancel.emit(true);
  }

  saveDrug(drug: Drug) {

  }

  editDrug(drug: Drug) {
    this.regimenDetailService.editDrug(drug).subscribe(drug => {
      this.getAllDrugs();
    });
  }

  addNewBrand(drug: Drug) {

  }

  showAddNewDrugModal() {
    this.displayAddNewBrandModal = true;
  }

  hideAddNewDrugModal() {
    this.displayAddNewBrandModal = false;
  }

  addNewDrug(drug: any) {
    this.hideAddNewDrugModal();
    this.regimenDetailService.addDrug(drug).subscribe(() => {
      this.getAllDrugs();
    })
  }
}
