import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SubcancertypeService} from '../../subcancertype.service';
import {Subcancertype2Service} from '../../subcancertype2.service';
import {Subcancertype3Service} from '../../subcancertype3.service';
import {CancerTypeService} from '../../cancer-type.service';
import {CancerType} from '../../state/CancerType';
// import {SelectItem} from 'primeng/api';
import {RegimenDetailService} from '../../regimen-detail.service';
import * as BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import {Level, RegimenDetail, Drug, RegimenReference} from "../../models/regimen-detail";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSelectChange} from '@angular/material/select';

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
  public drugList: Drug[] = [];

  public regimenLevelTypes: Level[] = [];

  editor = BalloonEditor;

  public schedule: string = "";

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
    this.getAllDrugs();

    this.regimenDetailService.displayLevelType.subscribe(changed => {
      this.getRegimenLevels();
    });

    this.createRegimenForm();
    this.schedule = this.regimenDetail.schedule;

    setTimeout(()=> {
      const ckEditorWrapper = document.getElementsByClassName('ck-body-wrapper')[0];
      document.getElementById('editRegimenModal').append(ckEditorWrapper);
    }, 2000);

  }

  getRegimenLevels() {
    this.regimenDetailService.getRegimenLevelTypes().subscribe((types) => {
      this.regimenLevelTypes = [...types];
      console.log(this.regimenLevelTypes);
    })
  }

  getAllDrugs() {
    this.regimenDetailService.getAllDrugs().subscribe((types) => {
      this.drugList = [...types];
      console.log(this.drugList);
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
    dispName: new FormControl(this.regimenDetail.dispName || '', [Validators.required]),
    schedule: new FormControl(this.regimenDetail.schedule || '', [Validators.required]),
    emetogenicPotential: new FormControl(this.regimenDetail.emetogenicPotential || '', [Validators.required]),
    references:  this.formBuilder.array(this.getReferenceFromControls()),
    dosageModifications: new FormControl(this.regimenDetail.dosageModifications || '', [Validators.required]),
    brands: this.formBuilder.array(this.getBrandFromControls()),
    regimenLevels: this.formBuilder.array(this.getLevelFromControls())
    })
  }

  getReferenceFromControls() {
    let referenceFCs = [];

    (this.regimenDetail.references || []).forEach(reference => {
      referenceFCs.push(new FormGroup({
        id: new FormControl(reference.id),
        referenceValue: new FormControl(reference.referenceValue || '')
      }));
    });

    return referenceFCs;
  }

  getBrandFromControls() {
    let referenceFCs = [];

    (this.regimenDetail.brands || []).forEach(brand => {
      referenceFCs.push(new FormGroup({
        id: new FormControl(brand.id),
        genericName: new FormControl(brand.genericName),
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
      referenceValue: new FormControl('', [Validators.required])
    }))
  }

  addNewBrand() {
    (<FormArray>this.regimenForm.get('brands')).push(new FormGroup({
      brandName: new FormControl(''),
      genericName: new FormControl('', [Validators.required]),
      manufacturer: new FormControl('')
    }))
  }

  addNewLevel(levelIdFromList?) {
    let formControlLevel = {};

    if (levelIdFromList) {
      if (isNaN(levelIdFromList)) {
        return;
      }

      formControlLevel = {
        level: new FormControl(this.regimenLevelTypes[levelIdFromList].level),
        id: new FormControl(this.regimenLevelTypes[levelIdFromList].id)
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

  removeDrugFromRegimen(index) {
    const drugName = this.regimenForm.get('brands').value && this.regimenForm.get('brands').value.length > index ? this.regimenForm.get('brands').value[index].genericName : '';

    (<FormArray>this.regimenForm.get('brands')).removeAt(index);

    this.modifySchedule(drugName, true);
    this.modifyDosageModification(drugName, true);
  }

  scheduleChanged() {
    this.regimenForm.get('schedule').setValue(this.schedule);
  }

  addDrugToRegimen(drugIndex) {
    if (isNaN(drugIndex)) {
      return;
    }
    let drug = {};
    const drugName = this.drugList[drugIndex].genericName;
    if (drugIndex) {
      drug = {
        genericName: new FormControl(drugName),
        id: new FormControl(this.drugList[drugIndex].id)
      };
    }

    (<FormArray>this.regimenForm.get('brands')).push(new FormGroup(drug));

    this.modifySchedule(drugName);
    this.modifyDosageModification(drugName);
  }

  modifySchedule(genericName: string, removeDrug?: boolean) {
    let schedule: string = this.regimenForm.get('schedule').value;
    const scheduleString = `\n<p><strong>${genericName}:&nbsp;</strong>XXXX mg/m<sup>2</sup>&nbsp;IV on day YYYY</p><p>Repeat cycles every ZZZZ weeks.</p>`;
    if (removeDrug) {
      schedule = schedule.replace(scheduleString, '');
    } else {
      schedule = schedule.concat(scheduleString);
    }

    this.regimenForm.get('schedule').setValue(schedule);
  }

  modifyDosageModification(genericName: string, removeDrug?: boolean) {
    let dosageModifications: string = this.regimenForm.get('dosageModifications').value;
    const dosageString = `\n<ul><li>${genericName}:<br>No dose reduction</li></ul>`;

    if (removeDrug) {
      dosageModifications = dosageModifications.replace(dosageString, '');
    } else {
      dosageModifications = dosageModifications.concat(dosageString);
    }

    this.regimenForm.get('dosageModifications').setValue(dosageModifications);
  }
}
