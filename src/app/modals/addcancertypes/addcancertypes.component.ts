import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {PatientsService} from '../../patients.service';
import {CancerType} from '../../state/CancerType';
import {CancerTreeService} from '../../services/cancer-tree.service';
import {CANCERS} from '../../constants/constants';



@Component({
  selector: 'app-addcancertypes',
  templateUrl: './addcancertypes.component.html',
  styleUrls: ['./addcancertypes.component.scss']
})
export class AddcancertypesComponent implements OnChanges {

  @Output() yes = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() Error: any;
  public patientNames = [];
  public subCancerTree: any = {};
  id: number;

  public CancerType: CancerType;

  constructor(private patientsService: PatientsService,
              private cancerTreeService: CancerTreeService){
    this.getCancerTreeDetails();
  }

  ngOnInit(): void {
    console.log(this.CancerType.title)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.Error.currentValue.login) {
      this.initEmptyUser();
    }
  }

  getCancerTreeDetails() {
    const cancerTree = this.cancerTreeService.cancer;
    for(let cancerType in cancerTree) {
      if(cancerType.indexOf('SUBCANCER') >= 0) {
        this.subCancerTree[cancerType] = cancerTree[cancerType];
      }
    }
    this.patientNames = cancerTree[CANCERS.PATIENT];
  }

  initEmptyUser() {
     this.CancerType = {
      title: '',
    };;
  }

  okay() {
    this.CancerType.patienttypeid = this.id;
    this.yes.emit(this.CancerType);
  }

  close(event?) {
    this.cancel.emit(event);
  }

  getPatientsNames() {
    const that = this;
    this.patientsService.getPatients().subscribe(function (resp) {
      that.patientNames = resp;
    }, function (error) {
      alert('Error getting patients');
    });
  }

  onSelect(event){
    this.id = event;
  }

}
