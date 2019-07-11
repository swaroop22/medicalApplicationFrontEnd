import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {MenuItem} from 'primeng/api';
import {RegimenDetailService} from '../../regimen-detail.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CancerTypeService} from '../../cancer-type.service';
import {CancerTreeService} from '../../services/cancer-tree.service';
import {CANCERS} from '../../constants/constants';


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
              private cancerTypeService: CancerTypeService,
              private routes: ActivatedRoute,
              private route: Router,
              private cancerTree: CancerTreeService,) {
    if(this.route.url == '/regimenDetails'){
      this.getAllRegimens();
    } else {
      this.getRegimens();
    }
    console.log(this.cancerTypeService.getBreadCrumbData());
    this.crumbs = this.cancerTypeService.getBreadCrumbData();
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
    this.RegimenDetailService.addRegimenDetail(event).subscribe(function (resp) {
      that.getRegimens();
      that.addModal.hide();
    }, function (error) {
      alert('Medicine add error ' + event.firstName);
    });
  }

  getAllRegimens(){
    this.cancerTypeService. getAllCancerTypes().subscribe((resp) => {
      this.RegimenDetails = resp;
      this.crumbs = [{label: 'PATIENTTYPE', styleClass: 'ui-breadcrumb', command: (event) => {
          this.route.navigateByUrl('patientTypes')
        }}];
    }, (error) => {
      alert('Error in getting medicines');
    });
  }

  getRegimens() {
    this.cancerTypeService.regimenId = this.routes.snapshot.params["id"];
    this.cancerTypeService.getCancerTypes().subscribe((resp) => {
      this.RegimenDetails = resp;
    }, (error) => {
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
