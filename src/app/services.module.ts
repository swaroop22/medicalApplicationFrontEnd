import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PatientsService} from './patients.service';
import {CancerTypeService} from './cancer-type.service';
import {SubcancertypeService} from './subcancertype.service';
import {RegimenDetailService} from './regimen-detail.service';
import {Subcancertype2Service} from './subcancertype2.service';
import {Subcancertype3Service} from './subcancertype3.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    PatientsService,
    CancerTypeService,
    SubcancertypeService,
    RegimenDetailService,
    Subcancertype2Service,
    Subcancertype3Service,
  ],
  declarations: []
})
export class ServicesModule {
}
