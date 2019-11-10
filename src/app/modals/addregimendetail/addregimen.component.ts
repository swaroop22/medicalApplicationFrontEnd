import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {SubcancertypeService} from '../../subcancertype.service';
import {ActivatedRoute} from '@angular/router';
import {Subcancertype2Service} from '../../subcancertype2.service';
import {Subcancertype3Service} from '../../subcancertype3.service';
import {RegimenDetailService} from '../../regimen-detail.service';
import {SelectItem} from 'primeng/api';
import {CancerTypeService} from '../../cancer-type.service';

@Component({
  selector: 'app-addregimen',
  templateUrl: './addregimen.component.html',
  styleUrls: ['./addregimen.component.scss']
})
export class AddregimenComponent {

  @Output() yes = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() Error: any;
  @Input() cancers: any[];
  id2: number;
  id3: number;
  id4: number;

  public RegimenDetail = {
    dispName: '',
    name: '',
    schedule: '',
    emetogenicPotential: '',
    reference: '',
    dosageModifications: '',
    brandNames: '',
    regimenType: '',
    subCancerTypeId3: '',
    id2: 0,
    id3: 0,
    id4: 0,
  };

  levelOptions: SelectItem[] = [];

  public subCancerTypes = {};
  public subCancerTypes2 = {};
  public subCancerTypes3 = {};

  public regimenLevels: string[] = [];

  cancerList: any[] = [];
  selectedCancers: any[] = [];

  constructor(private subCancerType1Service: SubcancertypeService,
              private subCancerType2Service: Subcancertype2Service,
              private subCancerType3Service: Subcancertype3Service,
              private regimenDetailService: RegimenDetailService,
              private cancerService: CancerTypeService,
              private routes: ActivatedRoute) {
  }

  ngOnInit() {

    if(this.cancers && this.cancers.length > 0) {
      this.cancers.forEach(cancer => {
        this.cancerList.push({
          label: cancer.title,
          value: cancer
        })
      })
    } else {
      this.cancerService.getAllCancerNames().subscribe(cancers => {
        this.cancerList = cancers;
      });
    }

    this.regimenDetailService.getRegimenLevelTypes().subscribe((types) => {
      this.regimenLevels = types;
      if(types.length > 0) {
        types.forEach(type => {
          this.levelOptions.push({
            label: type, value: type
          })
        });
      }
      console.log(this.regimenLevels)
    })
  }

  okay() {
    this.populateSubCancerLevels();
    if(this.regimenLevels.indexOf(this.RegimenDetail.regimenType) < 0) {
      this.regimenDetailService.addRegimenLevel(this.RegimenDetail.regimenType).subscribe(() => {
        this.yes.emit(this.RegimenDetail);
      })
    } else {

      this.yes.emit(this.RegimenDetail);
    }

  }

  close(event) {
    this.cancel.emit(event);
  }

  onSelect(event){
    this.id2 = event;
  }

  onSelect2(event){
    this.id3 = event;
  }

  onSelect3(event){
    this.id4 = event;
  }

  populateSubCancerLevels() {
    this.selectedCancers.forEach(selectedCancer => {
      if(this.RegimenDetail.subCancerTypeId3) {
        this.RegimenDetail.subCancerTypeId3 = this.RegimenDetail.subCancerTypeId3 + ',';
      } else {
        this.RegimenDetail.subCancerTypeId3 = '' + selectedCancer.id;
      }

      if(this.RegimenDetail.subCancerTypeId3 &&
        this.RegimenDetail.subCancerTypeId3.indexOf(selectedCancer.id) < 0) {
        this.RegimenDetail.subCancerTypeId3 = this.RegimenDetail.subCancerTypeId3 + selectedCancer.id;
      }
    });
  }
}
