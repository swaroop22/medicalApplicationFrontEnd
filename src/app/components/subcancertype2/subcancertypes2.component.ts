import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap';
import {MenuItem} from 'primeng/api';
import {Subcancertype2Service} from '../../subcancertype2.service';
import { Subcancertype3Service } from '../../subcancertype3.service';



@Component({
  selector: 'app-subcancertypes2',
  templateUrl: './subcancertypes2.component.html',
  styleUrls: ['./subcancertypes2.component.css']
})
export class Subcancertypes2Component implements OnInit {

  public subCancerTypes: any = [];
  @ViewChild('addModal') public addModal: ModalDirective;
  @ViewChild('deleteModal') public deleteModal: ModalDirective;
  @ViewChild('editModal') public editModal: ModalDirective;
  public isEditModal = false;
  public isDeleteModal = false;
  public isAddSubCancerTypeModal = false;
  public SubCancerType = {};
  public subcancerType3 = {};
  public addSubCancerTypeError = '';
  crumbs: MenuItem[];
  public url: string;

  constructor(private subCancerType1Service: Subcancertype2Service,
              private  subcancertype3Service : Subcancertype3Service,
              private routes: ActivatedRoute,
              private route: Router) {
    this.getSubCancerTypes();
    this.subcancertype3Service.getSubCancerTypes3(this.routes.snapshot.params["id"]).subscribe( value => {
      this.subcancerType3 = value;
    });

    if((this.subcancerType3 != null) && (Object.keys(this.subcancerType3).length != 0)){
      this.url = '/subCancerTypes3/';
    }
     else {
       this.url = '/regimenDetails';
    }

  }

  ngOnInit(): void {
    this.crumbs = [
      {label:'PATIENTTYPES', url: 'http://localhost:4200/patientTypes'},
      {label:'CANCERTYPES',   url: 'http://localhost:4200/cancerTypes' + '/' + this.routes.snapshot.params["id"]},
      {label:'SUBCANCERTYPES',   url: 'http://localhost:4200/subCancerTypes' + '/' + this.routes.snapshot.params["id"]},
      {label:'SUBCANCERTYPES2',  url: this.route.url}
    ]
  }

  showAddSubCancerType() {
    this.isAddSubCancerTypeModal = true;
  }

  getSubCancerTypes(){
    const that = this;
    this.subCancerType1Service.getSubCancerTypes2(this.routes.snapshot.params["id"]).subscribe(function (resp) {
      that.subCancerTypes = resp;
    }, function (error) {
      alert('Error in getting SubCancer Types');
    });
  }

  edit(obj) {
    this.SubCancerType = JSON.parse(JSON.stringify(obj));
    this.isEditModal = true;
  }

  delete(obj) {
    this.SubCancerType = JSON.parse(JSON.stringify(obj));
    this.isDeleteModal = true;
  }

  onClose(event) {
    if (event === 'add') {
      this.addModal.hide();
    }  else if (event === 'edit') {
      this.editModal.hide();
    } else if (event === 'delete') {
      this.deleteModal.hide();
    }
  }

  onHide(event) {
    if (event === 'add') {
      this.isAddSubCancerTypeModal = false;
    }  else if (event === 'edit') {
      this.isEditModal = false;
    } else if (event === 'delete') {
      this.isDeleteModal = false;
    }
  }

  addSubCancerTypes(event){
    const that = this;
    this.subCancerType1Service.addSubCancerTypes2(event).subscribe(function (resp) {
      that.getSubCancerTypes();
      that.addModal.hide();
    }, function (error) {
      alert('Person add error ' + event);
    });
  }

  editSubCancerTypes(data){
    const that = this;
    this.subCancerType1Service.editSubCancerTypes2(data).subscribe(function (resp) {
      that.getSubCancerTypes();
      that.editModal.hide();
    }, function (error) {
      alert('Error to update SubCancerType ' + data);
    });
  }

  deleteSubCancerTypes(data){
    const that = this;
    this.subCancerType1Service.deleteSubCancerTypes2(data.id).subscribe(function (resp) {
      that.getSubCancerTypes();
      that.deleteModal.hide();
    }, function (error) {
      alert('Error to update SubCancerType ' + data);
    });
  }

}
