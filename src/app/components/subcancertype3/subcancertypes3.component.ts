import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap';
import {MenuItem} from 'primeng/api';
import {Subcancertype3Service} from '../../subcancertype3.service';


@Component({
  selector: 'app-subcancertypes3',
  templateUrl: './subcancertypes3.component.html',
  styleUrls: ['./subcancertypes3.component.css']
})
export class Subcancertypes3Component implements OnInit {

  public subCancerTypes: any = [];
  @ViewChild('addModal') public addModal: ModalDirective;
  @ViewChild('deleteModal') public deleteModal: ModalDirective;
  @ViewChild('editModal') public editModal: ModalDirective;
  public isEditModal = false;
  public isDeleteModal = false;
  public isAddSubCancerTypeModal = false;
  public SubCancerType = {};
  public addSubCancerTypeError = '';
  crumbs: MenuItem[];

  constructor(private subcancertype3Service: Subcancertype3Service,
              private routes: ActivatedRoute,
              private route: Router) {
    this.getSubCancerTypes();
  }

  ngOnInit(): void {
    this.crumbs = [
      {label:'PATIENTTYPES',  url: 'http://localhost:4200/patientTypes'},
      {label:'CANCERTYPES',   url: 'http://localhost:4200/cancerTypes' + '/' + this.routes.snapshot.params["id"]},
      {label:'SUBCANCERTYPES',   url: 'http://localhost:4200/subCancerTypes' + '/' + this.routes.snapshot.params["id"]},
      {label:'SUBCANCERTYPES2',   url: 'http://localhost:4200/subCancerTypes2' + '/' + this.routes.snapshot.params["id"]},
      {label:'SUBCANCERTYPES3',   url: this.route.url}
    ]
  }

  showAddSubCancerType() {
    this.isAddSubCancerTypeModal = true;
  }

  getSubCancerTypes(){
    const that = this;
    this.subcancertype3Service.getSubCancerTypes3(this.routes.snapshot.params["id"]).subscribe(function (resp) {
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
    this.subcancertype3Service.addSubCancerTypes3(event).subscribe(function (resp) {
      that.getSubCancerTypes();
      that.addModal.hide();
    }, function (error) {
      alert('Person add error ' + event);
    });
  }

  editSubCancerTypes(data){
    const that = this;
    this.subcancertype3Service.editSubCancerTypes3(data).subscribe(function (resp) {
      that.getSubCancerTypes();
      that.editModal.hide();
    }, function (error) {
      alert('Error to update SubCancerType ' + data);
    });
  }

  deleteSubCancerTypes(data){
    const that = this;
    this.subcancertype3Service.deleteSubCancerTypes3(data.id).subscribe(function (resp) {
      that.getSubCancerTypes();
      that.editModal.hide();
    }, function (error) {
      alert('Error to update SubCancerType ' + data);
    });
  }

}
