import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RegimenDetailService} from '../../regimen-detail.service';
import {CancerTypeService} from "../../cancer-type.service";
import {CancerTreeService} from "../../services/cancer-tree.service";
import {RegimenDetail} from '../../models/regimen-detail';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'link-caner-regimen-modal',
  templateUrl: './link-cancer-regimen-modal.html',
  styleUrls: ['./link-cancer-regimen-modal.scss']
})
export class LinkCancerRegimenModal {
  @Input() currentCancerId: number;
  @Input() currentRegimenType: String;
  regimenLevels: any[];
  regimen: any[] = [];
  isLoading: boolean;
  addedRegimen: any[];


  existingRegimenInCancerToDisplay: RegimenDetail[] = [];
  regimenListToDisplay: RegimenDetail[] = [];

  existingRegimenInCancer: RegimenDetail[] = [];
  regimenList: RegimenDetail[] = [];

  filterRegimenList: FormControl = new FormControl();
  filterExistingCancerInRegimenList: FormControl = new FormControl();


  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  constructor(private regimenDetailService: RegimenDetailService,
              private cancerTreeService: CancerTreeService,
              private cancerTypeService: CancerTypeService ) {
  }

  ngOnInit() {

    this.filterRegimenList.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    )
      .subscribe(inputValue => {
        this.regimenListToDisplay =  this.regimenList.filter(regimen => {
          return regimen.dispName.indexOf(inputValue ) > -1
        })
      });

    this.filterExistingCancerInRegimenList.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    )
      .subscribe(inputValue => {
        this.existingRegimenInCancerToDisplay =  this.existingRegimenInCancer.filter(regimen => {
          return regimen.dispName.indexOf(inputValue ) > -1
        })
      });

    this.getAllRegimens();
  }


  close() {
    const selectedRegimen = [];
    this.existingRegimenInCancer.forEach(regimenDetail => {
      if (regimenDetail.isChanged) {
        selectedRegimen.push(regimenDetail.id);
      }
    });

    if(selectedRegimen.length > 0) {
      let currentCancerDetail: any = {id:''} ;
      (this.cancerTreeService.parentCancers || []).forEach(cancer => {
        if (cancer.id === (<any>this.cancerTreeService.getCurrentCancer()).id) {
          currentCancerDetail = cancer;
        }
      });

      this.cancerTypeService.updateRegimenInCancer(selectedRegimen.join(',')).subscribe(() => {
        this.closeModal.emit(false);
      });
    } else {
      this.closeModal.emit(false);
    }

  }

  edit(regimenLevel: any) {

  }

  delete(regimenLevel: any) {
    this.regimenDetailService.deleteLevel(regimenLevel).subscribe(deleted => {
      this.ngOnInit();
    });
  }

  getAllRegimens() {
    this.isLoading = true;
    this.regimenDetailService.getRegimenListToAddToCancer(this.currentCancerId, this.currentRegimenType).subscribe(cancerResponse => {
      this.existingRegimenInCancer = cancerResponse.existingRegimenInCancer;
      this.existingRegimenInCancerToDisplay = cancerResponse.existingRegimenInCancer;

      this.regimenList = cancerResponse.allRegimenListToAddToCancer;
      this.regimenListToDisplay = cancerResponse.allRegimenListToAddToCancer;

      this.isLoading = false;
    });
  }

  linkRegimenToCancer(regimenDetail, index) {
    const regimen = this.regimenList.splice(index, 1)[0];
    regimen.isChanged = true;
    this.existingRegimenInCancer.push(regimen);
    this.existingRegimenInCancerToDisplay = this.existingRegimenInCancer;
  }

  unLinkRegimenToCancer(regimenDetail: any, index: number) {
    this.regimenList.push(...this.existingRegimenInCancer.splice(index, 1));
  }
}
