import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SubcancertypeService} from '../../subcancertype.service';
import {Subcancertype2Service} from '../../subcancertype2.service';
import {Subcancertype3Service} from '../../subcancertype3.service';
import {CancerTypeService} from '../../cancer-type.service';
import {CancerType} from '../../state/CancerType';
// import {SelectItem} from 'primeng/api';
import {RegimenDetailService} from '../../regimen-detail.service';
import * as BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import {Level, RegimenDetail, Brand, RegimenReference} from "../../models/regimen-detail";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-editregimen',
  templateUrl: './editregimen.component.html',
  styleUrls: ['./editregimen.component.scss']
})
export class EditregimenComponent{
  @Output() yes = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() RegimenDetail: any;
  @Input() regimenDetail: RegimenDetail;
  levelOptions: any[] = [];
  cancerList: any[] = [];
  selectedCancers: any[] = [];
  public subCancerTypes = {};
  public subCancerTypes2 = {};
  public subCancerTypes3 = {};
  id: number;
  id2: number;
  id3: number;

  regimenForm: FormGroup;

  public regimenLevels: Level[] = [];

  editor = BalloonEditor;

  constructor(private subCancerType1Service: SubcancertypeService,
              private subCancerType2Service: Subcancertype2Service,
              private subCancerType3Service: Subcancertype3Service,
              private regimenDetailService: RegimenDetailService,
              private formBuilder: FormBuilder,
              private cancerService: CancerTypeService) {
  }

  ngOnInit() {
   // this.cancerService.getAllCancerNames().subscribe(cancers => {
   //   this.cancerList = cancers;
   //
   //   cancers.forEach(cancerSelectItem => {
   //     if(this.RegimenDetail.subCancerTypeId3 && this.RegimenDetail.subCancerTypeId3.length > 0) {
   //       this.RegimenDetail.subCancerTypeId3.split(",").forEach(cancerIndex =>{
   //         if (cancerSelectItem.value.id == cancerIndex) {
   //           this.selectedCancers.push(cancerSelectItem.value);
   //         }
   //       })
   //     }
   //   })
   //
   //   this.getRegimenLevels();
   //
   //   this.regimenDetailService.displayLevelType.subscribe(changed => {
   //     this.getRegimenLevels();
   //   });
   // })
    this.regimenForm = this.formBuilder.group(this.regimenDetail);
  }

  getRegimenLevels() {
    this.regimenDetailService.getRegimenLevelTypes().subscribe((types) => {
      this.regimenLevels = types;
      this.levelOptions = [];
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

    this.yes.emit(this.regimenDetail);
  }

  populateSubCancerLevels() {
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

  displayLevelTypeModal() {
    this.regimenDetailService.displayLevelTypeModal();
  }

  removeRegimenLevelFromRegimen(level: Level) {
    // @TODO code to remove level from regimen level list
  }

}
