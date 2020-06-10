import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {RegimenDetailService} from '../../regimen-detail.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CancerTypeService} from '../../cancer-type.service';
import {CancerTreeService} from '../../services/cancer-tree.service';
import {CANCERS} from '../../constants/constants';
import {RegimenDetail} from '../../models/regimen-detail';
import {PageEvent} from '@angular/material/paginator';
import * as BalloonEditor from '@ckeditor/ckeditor5-build-balloon';

@Component({
  selector: 'app-regimendetails',
  templateUrl: './regimendetails.component.html',
  styleUrls: ['./regimendetails.component.scss']
})
/**
 * Regimen Details component
 */
export class RegimendetailsComponent implements OnInit {
  @ViewChild('addModal') public addModal: ModalDirective;
  @ViewChild('editModal') public editModal: ModalDirective;
  @ViewChild('deleteModal') public deleteModal: ModalDirective;

  editor = BalloonEditor;
  @Output() public actionOnRegimen: EventEmitter<{action: string, regimen: any}> = new EventEmitter();
  @Output() public regimenActionCompleted: EventEmitter<boolean> = new EventEmitter();

  @Input() public RegimenDetails: RegimenDetail[] = [];
  public  regimenToDisplay: RegimenDetail[] = [];
  public isAddRegimenDetailsModal = false;
  public isEditModal = false;
  public isDeleteModal = false;
  isOnCancerRegimens:boolean = false;
  public showLinkRegimenModal: boolean;
  public RegimenDetail = {};
  public addRegimenDeatilsError = '';
  crumbs: any[];
  isLoading: boolean;
  pageEvent: PageEvent;
  regimenLevels: string[] = [];
  currentCancerId: number;
  currentRegimenType: string;

  constructor(private RegimenDetailService: RegimenDetailService,
              private cancerTypeService: CancerTypeService,
              private routes: ActivatedRoute,
              private route: Router,
              private cancerTree: CancerTreeService,
              private regimenDetailService: RegimenDetailService) {
  }

  ngOnInit() {
    if(this.route.url == '/regimenDetails'){
      this.getAllRegimens();
    } else if((this.route.url.indexOf('subCancers') > 0) || (this.route.url.indexOf('cancerTypes') > 0) ) {
      // regimens are already provided
      this.isOnCancerRegimens = true;
      this.setPaginationData();
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
      this.RegimenDetail = {};
      this.isEditModal = true;
    }
  }

  /**
   * Edit Regimen
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
   * Delete Regimen
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

  deleteFromCancer(regimenDetail: RegimenDetail) {
    this.regimenDetailService.deleteRegimenFromCancer([{regimenId: regimenDetail.id, cancerId: this.cancerTree.getCurrentCancer().id}]).subscribe(() => {
      this.refreshDataOnRegimenDetailsComponent();
    })
  }

  copyRegimen(regimenDetail: RegimenDetail) {
    regimenDetail.id = undefined;

    this.RegimenDetail = regimenDetail;
    this.isEditModal = true;
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
    this.isLoading = true;
    this.RegimenDetailService.addRegimenDetail(event).subscribe( (resp)  => {
      this.getRegimens();
      this.addModal.hide();
    },  (error) => {
      this.isLoading = false;
      alert('Error while adding regimen');
    });
  }

  deleteRegimenDetail(data) {
    this.isLoading = true;
    this.RegimenDetailService.deleteRegimenDetail(data.id).subscribe((resp) =>{
      if(!this.isOnCancerRegimens) {
        this.getRegimens();
        this.deleteModal.hide();
      } else {
        this.regimenActionCompleted.emit(true);
      }
    },  (error) => {
      this.isLoading = false;
      alert('Error in deleting regimen');
    });
  }

  editRegimenDetail(data, cancerId?) {
    this.isLoading = true;
    if (cancerId) {
      this.RegimenDetailService.updateRegimenDetailWithCancerId(data, cancerId)
        .subscribe((resp) => {
        this.refreshDataOnRegimenDetailsComponent();
      },  (error) => {
        alert('Error in updating regimen');
      });
    } else {
      this.RegimenDetailService.updateRegimenDetail(data)
        .subscribe((resp) => {
          this.refreshDataOnRegimenDetailsComponent();
      },  (error) => {
        alert('Error in updating regimen');
      });
    }
  }

  refreshDataOnRegimenDetailsComponent = () => {
    if(!this.isOnCancerRegimens) {
      this.getRegimens();
      this.editModal.hide();
    } else {
      this.regimenActionCompleted.emit(true);
    }
  };

  getAllRegimens(){
    this.isLoading = true;
    this.cancerTypeService.getRegimenById().subscribe((resp) => {
      this.isLoading = false;
      this.RegimenDetails = resp.regimenDetail;
      this.crumbs = this.getCrumbs(this.cancerTypeService.getBreadCrumbData(resp));
    }, (error) => {
      alert('Error while getting regimen');
    });
  }

  getCrumbs(crumbs: any[]) {
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
    this.cancerTypeService.regimenId = this.routes.snapshot.params["id"];
    this.currentCancerId = this.routes.snapshot.params["id"];
    this.currentRegimenType = this.routes.snapshot.params["regimenType"];
    if (this.currentRegimenType) {
      this.isLoading = true;
      this.cancerTypeService.getRegimenByIdAndType(this.currentCancerId, this.currentRegimenType).subscribe((resp) => {
        this.setRegimenAndDisplayData(resp);
      }, (error) => {
        this.isLoading = false;
        alert('Error while getting regimen');
      });
    }
    else {
      this.isLoading = true;
      this.cancerTypeService.getRegimenById(this.currentCancerId).subscribe((resp) => {
       this.setRegimenAndDisplayData(resp);
      }, (error) => {
        this.isLoading = false;
        alert('Error while getting regimen');
      });
    }
  }

  setRegimenAndDisplayData(response) {
    this.isLoading = false;
    this.RegimenDetails = response.regimenDetail;
    this.crumbs = this.getCrumbs(this.cancerTypeService.getBreadCrumbData(response));
    this.setPaginationData();
  }

  setPaginationData() {
    this.changeRegimenList({pageIndex: 0, pageSize: 10, length: this.RegimenDetails.length});
    this.getRegimenLevels();
  }

  changeRegimenList(pageEvent: any) {
    const startPointToSlice = pageEvent.pageIndex * pageEvent.pageSize;
    const endPointToSlice = startPointToSlice + pageEvent.pageSize;

    this.regimenToDisplay = this.RegimenDetails.slice(startPointToSlice, endPointToSlice);
  }
  getRegimenLevels() {
    this.regimenDetailService.getRegimenLevelTypes().subscribe((types) => {
      this.regimenLevels = types || [];
      });
  }

  showLinkRegimen(show: boolean) {
    this.showLinkRegimenModal = show;
    if(!this.showLinkRegimenModal) {
      this.getAllRegimens();
    }
  }
}
