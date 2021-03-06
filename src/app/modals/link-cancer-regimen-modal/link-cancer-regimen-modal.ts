import {Component, EventEmitter, Output} from '@angular/core';
import {RegimenDetailService} from '../../regimen-detail.service';
import {CancerTypeService} from "../../cancer-type.service";
import {CancerTreeService} from "../../services/cancer-tree.service";

@Component({
  selector: 'link-caner-regimen-modal',
  templateUrl: './link-cancer-regimen-modal.html',
  styleUrls: ['./link-cancer-regimen-modal.scss']
})
export class LinkCancerRegimenModal {
  regimenLevels: any[];
  regimen: any[] = [];
  isLoading: boolean;
  addedRegimen: any[];
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  constructor(private regimenDetailService: RegimenDetailService,
              private cancerTreeService: CancerTreeService,
              private cancerTypeService: CancerTypeService ) {
  }

  ngOnInit() {
    this.getAllRegimens();
  }


  close() {
    const selectedRegimen = [];
    this.regimen.forEach(regimenDetail => {
      if (regimenDetail.isChanged) {
        selectedRegimen.push(regimenDetail.regimen.id);
      }
    });

    if(selectedRegimen.length > 0) {let currentCancerDetail: any = {id:''} ;
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
    let currentCancer: any = this.cancerTreeService.getCurrentCancer();

    this.cancerTypeService.getRegimenById().subscribe((resp) => {
      this.isLoading = false;
      (resp.regimenDetail || []).forEach((regimen) => {
        const singleRegimen = {regimen: regimen, isChecked: false, isChanged: false};
        (currentCancer.regimen || '').split(',').forEach((regimenDetail) => {
          if(singleRegimen.regimen.id == regimenDetail) {
            singleRegimen.isChecked = true;
          }
        });

        this.regimen.push(singleRegimen);
      });
    }, (error) => {
      alert('Error while getting regimen');
    });
  }

  linkRegimenToCancer() {

  }
}
