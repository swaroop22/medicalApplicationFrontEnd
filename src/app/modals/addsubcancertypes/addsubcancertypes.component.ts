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
  public CancerTypes: any = [];

  dropDownForm: FormGroup;
  public CancerType = {
    title: '',
    id: 0,
    subcancertypeid: 0
  };

  constructor(private cancerTypeService: CancerTypeService,
              private cancerTreeService: CancerTreeService,
              private routes: ActivatedRoute) {
    this.cancerTree = this.cancerTreeService.cancer;
  }

  ngOnInit(): void {
    this.getCancerTypes();
    this.getSubCancerDropDowns();
  }

  getSubCancerDropDowns() {
    const subCancerTypes = Object.keys(this.cancerTreeService.cancer);
    //this.dropDownForm = new FormGroup();
    const controls = {};

    subCancerTypes.forEach((subCancer) => {
      controls[subCancer] = new FormControl()
    })

    this.dropDownForm = new FormGroup(controls);

  }


  ngOnChanges(changes: SimpleChanges) {
    if (!changes.Error.currentValue.login) {
      this.initEmptyUser();
    }
  }

  getCancerTypes(){
    const that = this;
    this.cancerTypeService.getCancerTypes(this.routes.snapshot.params["id"]).subscribe(function (resp) {
      that.CancerTypes = resp;
    }, function (error) {
      alert('Error in getting medicines');
    });
  }

  initEmptyUser() {
    var CancerType = {
      title: '',
      id: 0,
      subcancertypeid: 0
    };

    this.CancerType = JSON.parse(JSON.stringify(CancerType));
  }

  okay() {
    this.CancerType.id = this.id;
    this.CancerType.subcancertypeid = this.id;
    this.yes.emit(this.CancerType);
  }

  close(event) {
    this.cancel.emit(event);
  }

  onSelect(event){
    this.CancerType[event.key] = event.value;
  }

}
