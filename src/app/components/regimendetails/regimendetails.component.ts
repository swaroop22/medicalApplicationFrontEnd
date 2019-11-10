import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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


  @Output() public actionOnRegimen: EventEmitter<{action: string, regimen: any}> = new EventEmitter();
  @Output() public regimenActionCompleted: EventEmitter<boolean> = new EventEmitter();

  @Input() public RegimenDetails: any = [];
  public isAddRegimenDetailsModal = false;
  public isEditModal = false;
  public isDeleteModal = false;
  isOnCancerRegimens:boolean = false;
  public RegimenDetail = {};
  public addRegimenDeatilsError = '';
  crumbs: MenuItem[];

  constructor(private RegimenDetailService: RegimenDetailService,
              private cancerTypeService: CancerTypeService,
              private routes: ActivatedRoute,
              private route: Router,
              private cancerTree: CancerTreeService,) {
  }

  ngOnInit() {
    if(this.route.url == '/regimenDetails'){
      this.getAllRegimens();
    } else if((this.route.url.indexOf('subCancers') > 0) || (this.route.url.indexOf('cancerTypes') > 0) ) {
      // regimens are already provided
      this.isOnCancerRegimens = true;
    } else {
      this.getRegimens();
    }
    console.log(this.cancerTypeService.getBreadCrumbData());
  }

  /**
   * Display Regimen Details Modal
   */
  showAddRegimenDetails() {
    if(this.isOnCancerRegimens){
      this.actionOnRegimen.emit({action: 'add', regimen: undefined});
    } else {
      this.isAddRegimenDetailsModal = true;
    }
  }

  /**
   * Edit Medicine
   * @param obj is persion object
   */
  edit(obj) {
    if(this.isOnCancerRegimens){
      this.actionOnRegimen.emit({action: 'edit', regimen: obj});
    } else {
      this.RegimenDetail = JSON.parse(JSON.stringify(obj));
      this.isEditModal = true;
    }
  }


  /**
   * Delete medicine
   * @param obj
   */
  delete(obj) {
    if(this.isOnCancerRegimens){
      this.actionOnRegimen.emit({action: 'delete', regimen: obj});
    } else {
      this.RegimenDetail = JSON.parse(JSON.stringify(obj));
      this.isDeleteModal = true;
    }
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
      alert('Error while adding regimen');
    });
  }

  deleteRegimenDetail(data) {
    this.RegimenDetailService.deleteRegimenDetail(data.id).subscribe((resp) =>{
      if(!this.isOnCancerRegimens) {
        this.getRegimens();
        this.deleteModal.hide();
      } else {
        this.regimenActionCompleted.emit(true);
      }
    }, function (error) {
      alert('Error in deleting regimen');
    });
  }

  editRegimenDetail(data) {
    this.RegimenDetailService.updateRegimenDetail(data).subscribe((resp) => {
      if(!this.isOnCancerRegimens) {
        this.getRegimens();
        this.editModal.hide();
      } else {
        this.regimenActionCompleted.emit(true);
      }
    }, function (error) {
      alert('Error in updating regimen');
    });
  }

  getAllRegimens(){
    this.cancerTypeService.getRegimenById().subscribe((resp) => {
      this.RegimenDetails = resp.regimenDetail;
      this.crumbs = this.getCrumbs(this.cancerTypeService.getBreadCrumbData(resp));
    }, (error) => {
      alert('Error while getting regimen');
    });
  }

  getCrumbs(crumbs: MenuItem[]) {
    const regimenType = this.routes.snapshot.params["regimenType"];
    if(regimenType) {
      crumbs.push({label: regimenType, styleClass: 'ui-breadcrumb'});
    }
    else {
      crumbs.push({label: 'REGIMENDETAILS', styleClass: 'ui-breadcrumb'});
    }

    return crumbs;
  }

  getRegimens() {
    const regimenId = this.routes.snapshot.params["id"];
    this.cancerTypeService.regimenId = this.routes.snapshot.params["id"];
    const regimenType = this.routes.snapshot.params["regimenType"];
    if (regimenType) {
      this.cancerTypeService.getRegimenByIdAndType(regimenId, regimenType).subscribe((resp) => {
        this.RegimenDetails = resp.regimenDetail;
        this.crumbs = this.getCrumbs(this.cancerTypeService.getBreadCrumbData(resp));
      }, (error) => {
        alert('Error while getting regimen');
      });
    }
    else {
      this.cancerTypeService.getRegimenById(regimenId).subscribe((resp) => {
        this.RegimenDetails = resp.regimenDetail;
        this.crumbs = this.getCrumbs(this.cancerTypeService.getBreadCrumbData(resp));
      }, (error) => {
        alert('Error while getting regimen');
      });
    }
  }

}
