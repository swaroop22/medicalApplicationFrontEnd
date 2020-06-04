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
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

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
  newLevelType = new FormControl('', [Validators.required]);
  cancerList: any[] = [];
  public subCancerTypes = {};
  public subCancerTypes2 = {};
  public subCancerTypes3 = {};
  id: number;
  id2: number;
  id3: number;
  dummy: any;
  regimenForm: FormGroup;

  public regimenLevelTypes: Level[] = [];

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
    this.getRegimenLevels();

    this.regimenDetailService.displayLevelType.subscribe(changed => {
      this.getRegimenLevels();
    });

    this.createRegimenForm();
  }

  getRegimenLevels() {
    this.regimenDetailService.getRegimenLevelTypes().subscribe((types) => {
      this.regimenLevelTypes = [...types];
      console.log(this.regimenLevelTypes);
    })
  }

  okay() {
    this.populateSubCancerLevels();

    this.yes.emit(this.regimenForm.getRawValue());
  }

  populateSubCancerLevels() {
  }

  close(event) {
    this.cancel.emit(event);
  }

  createRegimenForm() {
    this.regimenForm = this.formBuilder.group({
    id: new FormControl(this.regimenDetail.id),
    dispName: new FormControl(this.regimenDetail.dispName, [Validators.required]),
    schedule: new FormControl(this.regimenDetail.schedule, [Validators.required]),
    emetogenicPotential: new FormControl(this.regimenDetail.emetogenicPotential, [Validators.required]),
    references:  this.formBuilder.array(this.getReferenceFromControls()),
    dosageModifications: new FormControl(this.regimenDetail.dosageModifications, [Validators.required]),
    brands: this.formBuilder.array(this.getBrandFromControls()),
    regimenLevels: this.formBuilder.array(this.getLevelFromControls())
    })
  }

  getReferenceFromControls() {
    let referenceFCs = [];

    (this.regimenDetail.references || []).forEach(reference => {
      referenceFCs.push(new FormGroup({
        id: new FormControl(reference.id),
        referenceValue: new FormControl(reference.referenceValue)
      }));
    });

    return referenceFCs;
  }

  getBrandFromControls() {
    let referenceFCs = [];

    (this.regimenDetail.brands || []).forEach(brand => {
      referenceFCs.push(new FormGroup({
        id: new FormControl(brand.id),
      brandName: new FormControl(brand.brandName),
      genericName: new FormControl(brand.genericName),
      manufacturer: new FormControl(brand.manufacturer)
      }))
    });

    return referenceFCs;
  }

  getLevelFromControls() {
    let referenceFCs = [];

    (this.regimenDetail.regimenLevels || []).forEach(level => {
      referenceFCs.push(new FormGroup({
        id: new FormControl(level.id),
        level: new FormControl(level.level)
      }));
    });

    return referenceFCs;
  }

  addNewReference() {
    (<FormArray>this.regimenForm.get('references')).push(new FormGroup({
      referenceValue: new FormControl('')
    }))
  }

  addNewBrand() {
    (<FormArray>this.regimenForm.get('brands')).push(new FormGroup({
      brandName: new FormControl(''),
      genericName: new FormControl(''),
      manufacturer: new FormControl('')
    }))
  }

  addNewLevel(levelIdFromList?) {
    let formControlLevel = {};

    if (levelIdFromList) {
      formControlLevel = {
        level: new FormControl(this.regimenLevelTypes[levelIdFromList-1].level),
        id: new FormControl(this.regimenLevelTypes[levelIdFromList-1].id)
      };
    } else {
      formControlLevel = {
        level: new FormControl(this.newLevelType.value)
      };

      this.newLevelType.reset();
    }

    (<FormArray>this.regimenForm.get('regimenLevels')).push(new FormGroup(formControlLevel));
  }

  removeBrand(index: number) {
    (<FormArray>this.regimenForm.get('brands')).removeAt(index);
  }

  removeReference(index: number) {
    (<FormArray>this.regimenForm.get('references')).removeAt(index);
  }


  removeRegimenLevelFromRegimen(index) {
    (<FormArray>this.regimenForm.get('regimenLevels')).removeAt(index);
  }
}
