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

    cancerService.getAllCancerNames().subscribe(cancerList => {
      (cancerList.allCancers || []).forEach(cancer => {

        if(cancer && cancer.length >= 1) {
          const cancerType: CancerType = new CancerType();
          cancerType.title = cancer[1];
          cancerType.id = cancer[0];
          this.cancerList.push({
            label: cancerType.title,
            value: cancerType
          })
        }
      })
    })
  }

  okay() {
    this.RegimenDetail.id = this.id;
    this.RegimenDetail.id2 = this.id2;
    this.RegimenDetail.id3 = this.id3;
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
