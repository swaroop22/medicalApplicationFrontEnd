import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {PatientsService} from '../../patients.service';
import {CancerType} from '../../state/CancerType';



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
  id: number;

  public CancerType: CancerType;

  constructor(private patientsService: PatientsService){
    this.getPatientsNames();
  }

  ngOnInit(): void {
    console.log(this.CancerType.title)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.Error.currentValue.login) {
      this.initEmptyUser();
    }
  }

  initEmptyUser() {
    var CancerType = {
      title: '',
      id: 0
    };

    this.CancerType = JSON.parse(JSON.stringify(CancerType));
  }

  okay() {
    this.CancerType.patienttypeid = this.id;
    this.yes.emit(this.CancerType);
  }

  close(event) {
    this.cancel.emit(event);
  }

  getPatientsNames() {
    const that = this;
    this.patientsService.getPatients().subscribe(function (resp) {
      that.patientNames = resp;
    }, function (error) {
      alert('Error in getting medicines');
    });
  }

  onSelect(event){
    this.id = event;
  }

}
