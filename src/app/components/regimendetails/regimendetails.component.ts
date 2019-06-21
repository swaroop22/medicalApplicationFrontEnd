import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {MenuItem} from 'primeng/api';
import {RegimenDetailService} from '../../regimen-detail.service';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-regimendetails',
  templateUrl: './regimendetails.component.html',
  styleUrls: ['./regimendetails.component.css']
})
/**
 * Regimen Details component
 */
export class RegimendetailsComponent implements OnInit {
  @ViewChild('addModal') public addModal: ModalDirective;
  @ViewChild('editModal') public editModal: ModalDirective;
  @ViewChild('deleteModal') public deleteModal: ModalDirective;


  public RegimenDetails: any = [];
  public isAddRegimenDetailsModal = false;
  public isEditModal = false;
  public isDeleteModal = false;

  public RegimenDetail = {};
  public addRegimenDeatilsError = '';
  crumbs: MenuItem[];

  constructor(private RegimenDetailService: RegimenDetailService,
              private routes: ActivatedRoute,
              private route: Router) {
    this.getRegimens();
    this.crumbs = [
      {label:'PATIENTTYPES', url: 'http://localhost:4200/patientTypes'},
      {label:'CANCERTYPES',url: 'http://localhost:4200/cancerTypes' + '/' +this.routes.snapshot.params["id"]},
      {label:'SUBCANCERTYPES', disabled: true, url: 'http://localhost:4200/subCancerTypes' + '/' + this.routes.snapshot.params["id"]},
      {label:'SUBCANCERTYPES2', url: 'http://localhost:4200/subCancerTypes2' + '/' + this.routes.snapshot.params["id"]},
      {label:'SUBCANCERTYPES3', url: 'http://localhost:4200/subCancerTypes3' + '/' + this.routes.snapshot.params["id"]},
      {label:'REGIMENDETAILS',url: this.route.url}
    ]
  }

  ngOnInit() {
  }

  /**
   * Display Regimen Details Modal
   */
  showAddRegimenDetails() {
    this.isAddRegimenDetailsModal = true;
  }

  /**
   * Edit Medicine
   * @param obj is persion object
   */
  edit(obj) {
    this.RegimenDetail = JSON.parse(JSON.stringify(obj));
    this.isEditModal = true;
  }


  /**
   * Delete medicine
   * @param obj
   */
  delete(obj) {
    this.RegimenDetail = JSON.parse(JSON.stringify(obj));
    this.isDeleteModal = true;
  }

  /**
   * Model dialong on close
   * @param event
   */
  onClose(event) {
    if (event === 'add') {
      this.addModal.hide();
    } else if (event === 'edit') {
      this.editModal.hide();
    } else if (event === 'delete') {
      this.deleteModal.hide();
    }
  }

  /**
   * Model dialog on hide
   * @param event
   */
  onHide(event) {
    if (event === 'add') {
      this.isAddRegimenDetailsModal = false;
    }else if (event === 'edit') {
      this.isEditModal = false;
    } else if (event === 'delete') {
      this.isDeleteModal = false;
    }
  }

  addRegimenDetail(event) {
    const that = this;
    event.dob = new Date(event.dob);
    this.RegimenDetailService.addRegimenDetail(event).subscribe(function (resp) {
      that.getRegimens();
      that.addModal.hide();
    }, function (error) {
      alert('Medicine add error ' + event.firstName);
    });
  }

  getRegimens() {
    const that = this;
    this.RegimenDetailService.getRegimenDetails(this.routes.snapshot.params["id"]).subscribe(function (resp) {
      that.RegimenDetails = resp;
    }, function (error) {
      alert('Error in getting medicines');
    });
  }

  deleteRegimenDetail(data) {
    const that = this;
    this.RegimenDetailService.deleteRegimenDetail(data.subCancerTypeId2).subscribe(function (resp) {
      that.getRegimens();
      that.deleteModal.hide();
    }, function (error) {
      alert('Error in delete medicine ' + data.firstName);
    });
  }

  editRegimenDetail(data) {
    const that = this;
    this.RegimenDetailService.updateRegimenDetail(data).subscribe(function (resp) {
      that.getRegimens();
      that.editModal.hide();
    }, function (error) {
      alert('Error to update medicine ' + data.firstName);
    });
  }
}
