import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SubcancertypeService} from '../../subcancertype.service';
import {Subcancertype2Service} from '../../subcancertype2.service';
import {Subcancertype3Service} from '../../subcancertype3.service';
import {CancerTypeService} from '../../cancer-type.service';
import {CancerType} from '../../state/CancerType';

@Component({
  selector: 'app-editregimen',
  templateUrl: './editregimen.component.html',
  styleUrls: ['./editregimen.component.scss']
})
export class EditregimenComponent{
  @Output() yes = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() RegimenDetail: any;

  cancerList: any[] = [];
  selectedCancers: any[] = [];
  public subCancerTypes = {};
  public subCancerTypes2 = {};
  public subCancerTypes3 = {};
  id: number;
  id2: number;
  id3: number;

  constructor(private subCancerType1Service: SubcancertypeService,
              private subCancerType2Service: Subcancertype2Service,
              private subCancerType3Service: Subcancertype3Service,
              private cancerService: CancerTypeService) {
  }

  ngOnInit() {
   this.cancerService.getAllCancerNames().subscribe(cancers => {
     this.cancerList = cancers;

     cancers.forEach(cancerSelectItem => {
       if(this.RegimenDetail.subCancerTypeId3 && this.RegimenDetail.subCancerTypeId3.length > 0) {
         this.RegimenDetail.subCancerTypeId3.split(",").forEach(cancerIndex =>{
           if (cancerSelectItem.value.id == cancerIndex) {
             this.selectedCancers.push(cancerSelectItem.value);
           }
         })
       }
     })
   })
  }

  okay() {
    this.selectedCancers.forEach(selectedCancer => {
      if(this.RegimenDetail.subCancerTypeId3.split(',').indexOf(selectedCancer.id + '') < 0) {
        if(this.RegimenDetail.subCancerTypeId3) {
          this.RegimenDetail.subCancerTypeId3 = this.RegimenDetail.subCancerTypeId3 + ',';
        }
        this.RegimenDetail.subCancerTypeId3 = this.RegimenDetail.subCancerTypeId3 + selectedCancer.id;
      }
    });

    this.yes.emit(this.RegimenDetail);
  }

  close(event) {
    this.cancel.emit(event);
  }


  onSelect(event){
    this.id = event;
  }

  onSelect2(event){
    this.id2 = event;
  }

  onSelect3(event){
    this.id3 = event;
  }

}
