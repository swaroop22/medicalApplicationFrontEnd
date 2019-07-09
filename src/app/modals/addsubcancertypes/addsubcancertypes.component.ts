import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {CancerTypeService} from '../../cancer-type.service';
import {ActivatedRoute} from '@angular/router';
import {CANCERS} from '../../constants/constants';
import {CancerTree} from '../../state/CancerTree';
import {CancerTreeService} from '../../services/cancer-tree.service';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-addsubcancertypes',
  templateUrl: './addsubcancertypes.component.html',
  styleUrls: ['./addsubcancertypes.component.scss']
})
export class AddsubcancertypesComponent implements OnChanges {

  @Output() yes = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() Error: any;
  cancerTree: CancerTree;
  id: number;
  public dropDownData: any = [];

  dropDownForm: FormGroup;
  public subCancerAddData = {
    title: '',
    id: 0,
    previousId: 0
  };

  constructor(private cancerTypeService: CancerTypeService,
              private cancerTreeService: CancerTreeService,
              private routes: ActivatedRoute) {
    this.cancerTree = this.cancerTreeService.cancer;
  }

  ngOnInit(): void {
    this.getLastLevelToAddSubLevelTo();
  }

  getSubCancerDropDowns() {
    const subCancerTypes = Object.keys(this.cancerTreeService.cancer);
    //this.dropDownForm = new FormGroup();
    const controls = {};

    subCancerTypes.forEach((subCancer) => {
      controls[subCancer] = new FormControl()
    });

    this.dropDownForm = new FormGroup(controls);

  }


  ngOnChanges(changes: SimpleChanges) {
    if (!changes.Error.currentValue.login) {
      this.initEmptyUser();
    }
  }

  initEmptyUser() {
    var CancerType = {
      title: '',
      previousId: ''
    };

    this.subCancerAddData = JSON.parse(JSON.stringify(CancerType));
  }

  okay() {
    this.yes.emit(this.subCancerAddData);
  }

  close(event) {
    this.cancel.emit(event);
  }

  onSelect(event){
    this.subCancerAddData.previousId = event;
  }

  getLastLevelToAddSubLevelTo() {
    this.dropDownData = this.cancerTreeService.cancer[this.cancerTreeService.getCurrentLevel()];
  }

}
