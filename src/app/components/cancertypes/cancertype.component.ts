import {CancerTypeService} from '../../cancer-type.service';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from '@angular/router';
import {CancerType} from '../../state/CancerType';
import {ModalDirective} from 'ngx-bootstrap';
import {MenuItem, TreeNode} from 'primeng/api';
import {Component, OnInit, ViewChild} from '@angular/core';
import {SubcancertypeService} from '../../subcancertype.service';
import {Subcancertype2Service} from '../../subcancertype2.service';
import { Subcancertype3Service } from '../../subcancertype3.service';
import {CANCERS} from '../../constants/constants';
import {CancerTree} from '../../state/CancerTree';
import {CancerTreeService} from '../../services/cancer-tree.service';
import {filter} from 'rxjs/operators';
import {RegimenDetailService} from '../../regimen-detail.service';
import {RegimendetailsComponent} from '../regimendetails/regimendetails.component';

@Component({
  selector: 'app-cancertype',
  templateUrl: './cancertype.component.html',
  styleUrls: ['./cancertype.component.css']
})
export class CancertypeComponent {

  public CancerTypes: any = [];
  @ViewChild('addModal') public addModal: ModalDirective;
  @ViewChild('deleteModal') public deleteModal: ModalDirective;
  @ViewChild('editModal') public editModal: ModalDirective;
  @ViewChild('regimenDetailComponent') public regimenDetailComponent: RegimendetailsComponent;

  addingNextLevel: boolean;

  public isEditModal = false;
  public isDeleteModal = false;
  crumbs: MenuItem[];
  public isAddCancerTypeModal = false;
  public CancerType = {};
  public addCancerTypeError = '';
  public subCancerType = {};
  public subCancerType2 = {};
  public subCancerType3  = {};
  public url: string;
  public regimenDetails = [];
  currentCancerId = '';
  id: number;

  navigateOnAdding: boolean = false;
  addButtonName: string = '';
  isAddSubCancerTypeModal: boolean;


  files: TreeNode[];

  cols: any[];
  displayAddRegimen: boolean;
  isEditRegimenModal: boolean;
  isDeleteRegimenModal: boolean;
  RegimenDetail: any;

  constructor(private cancerTypeService: CancerTypeService,
              private routes: ActivatedRoute,
              private route: Router,
              private regimenDetailService: RegimenDetailService,
              private cancerTree: CancerTreeService) {
  }

  ngOnInit() {
    this.routes.params.subscribe(params => {
      // this line to refresh on same route
      this.getCancerTypes();
    });
  }

  getCancerTypes(){
   this.cancerTypeService.getCancerById().subscribe( (resp) => {
      this.CancerTypes = resp.subCancers;
      this.crumbs = this.cancerTypeService.getBreadCrumbData(resp);
      this.addButtonName = this.cancerTree.nextItemToFetch();
      this.regimenDetails = resp.regimenDetail;
      this.currentCancerId = resp.id;
      if(this.CancerTypes.length === 0)
      {
        this.crumbs.splice(this.crumbs.length - 1, 1);
        this.crumbs.push({label: CANCERS.REGIMEN_DETAILS,styleClass: 'ui-breadcrumb'});
        this.cancerTypeService.setBreadCrumbData(this.crumbs);
        const latestItemAdded = this.cancerTypeService.cancerTypeId;
        if(resp.id) {
          this.route.navigateByUrl('regimenDetails/' + resp.id);
        }
      }
    }, (error) => {
      alert('Error in cancer types');
    });
  }

  showAddCancerType() {
    this.isAddSubCancerTypeModal = true;
    this.addingNextLevel = false;
  }

  showAddSubCancerType() {
    this.navigateOnAdding = true;
    this.isAddSubCancerTypeModal = true;
    this.addingNextLevel = true;
  }


  edit(obj) {
    this.CancerType = JSON.parse(JSON.stringify(obj));
    this.isEditModal = true;
  }

  delete(obj) {
    this.CancerType = JSON.parse(JSON.stringify(obj));
    this.isDeleteModal = true;
  }

  onClose(event) {
    if (event === 'add') {
      this.isAddSubCancerTypeModal = false;
    }  else if (event === 'edit') {
      this.isEditModal = false;
    } else if (event === 'delete') {
      this.isDeleteModal = false;
    } else if (event === 'regimen') {
      this.displayAddRegimen = false;
    } else if (event === 'editRegimen') {
      this.isEditRegimenModal = false;
    } else if (event === 'deleteRegimen') {
      this.isDeleteRegimenModal = false;
    }
  }

  onHide(event) {
    if (event === 'add') {
      this.isAddSubCancerTypeModal = false;
    }  else if (event === 'edit') {
      this.isEditModal = false;
    } else if (event === 'delete') {
      this.isDeleteModal = false;
    } else if (event === 'editRegimen') {
      this.isEditRegimenModal = false;
    } else if (event === 'deleteRegimen') {
      this.isDeleteRegimenModal = false;
    }
  }

  editCancerTypes(data){
    const that = this;
    this.cancerTypeService.editCancerTypes(data).subscribe(function (resp) {
      that.getCancerTypes();
      that.editModal.hide();
    }, function (error) {
      alert('Error to update cancer types ' + data);
    });
  }

  deleteCancerTypes(data){
    const that = this;
    this.cancerTypeService.deleteCancerTypes(data.id, CANCERS.SUBCANCER1).subscribe(function (resp) {
      that.getCancerTypes();
      that.deleteModal.hide();
    }, function (error) {
      alert('Error to update medicine ' + data);
    });
  }

  addCancerTypes(event) {

    // this.cancerTypeService.addId(event.previousId);
    this.cancerTypeService.addCancerTypes(event).subscribe((resp) => {
      const type = this.cancerTree.getCurrentLevel();
      this.addModal.hide();
      this.ngOnInit();
    }, function (error) {
      alert('Person add error ' + event);
    });
  }

  getUrlFix(id: number) {
    this.route.navigateByUrl('subCancers/' + id);
  }

  routeToPage(event, item) {
    const a = event;
  }


  generateTreeNodesForRegimens(regimenData: any[]) {
    const data = {};
    if(regimenData) {
      regimenData.forEach((regimen) => {
        if(regimen && regimen.regimenType) {
          data[regimen.regimenType] = regimen.regimenType;
        }
      });
    }
    return Object.keys(data);
  }

  showAddRegimen() {
    this.displayAddRegimen = true;
  }

  addRegimenDetail(regimen: any) {
    this.regimenDetailService.addRegimenDetailWithSubCancerType(regimen).subscribe((resp) => {
      this.displayAddRegimen = false;
      this.ngOnInit();
    }, (error) => {
      alert('Regimen add failed');
    });
  }

  actionOnRegimen(data: {action: string, regimen: any}) {
   if(data.action === 'edit') {
      this.RegimenDetail = data.regimen;
      this.isEditRegimenModal = true;
    } else if(data.action === 'delete') {
      this.RegimenDetail = data.regimen;
      this.isDeleteRegimenModal = true;
    }
  }

  refreshData() {
    this.ngOnInit();
    this.isDeleteRegimenModal = false;
    this.isEditRegimenModal = false;
  }
}
