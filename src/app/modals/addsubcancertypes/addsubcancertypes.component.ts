import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {CancerTypeService} from '../../cancer-type.service';
import {ActivatedRoute} from '@angular/router';
import {CANCERS} from '../../constants/constants';

@Component({
  selector: 'app-addsubcancertypes',
  templateUrl: './addsubcancertypes.component.html',
  styleUrls: ['./addsubcancertypes.component.scss']
})
export class AddsubcancertypesComponent implements OnChanges {

  @Output() yes = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() Error: any;
  id: number;
  public CancerTypes: any = [];

  public CancerType = {
    title: '',
    id: 0,
    subcancertypeid: 0
  };

  constructor(private cancerTypeService: CancerTypeService,
              private routes: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.getCancerTypes();
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
    this.id = event;
  }

}
