import {CancerTypeService} from '../../cancer-type.service';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from '@angular/router';
import {CancerType} from '../../state/CancerType';
import {ModalDirective} from 'ngx-bootstrap';
import {MenuItem} from 'primeng/api';
import {Component, OnInit, ViewChild} from '@angular/core';
import {SubcancertypeService} from '../../subcancertype.service';
import {Subcancertype2Service} from '../../subcancertype2.service';
import { Subcancertype3Service } from '../../subcancertype3.service';
import {CANCERS} from '../../constants/constants';
import {CancerTree} from '../../state/CancerTree';
import {CancerTreeService} from '../../services/cancer-tree.service';
import {filter} from 'rxjs/operators';

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
  id: number;

  navigateOnAdding: boolean = false;
  addButtonName: string = '';
  isAddSubCancerTypeModal: boolean;

  constructor(private cancerTypeService: CancerTypeService,
              private routes: ActivatedRoute,
              private route: Router,
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
      this.crumbs = this.cancerTypeService.getBreadCrumbData();
      this.addButtonName = this.cancerTree.nextItemToFetch();

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
  }

  showAddSubCancerType() {
    this.navigateOnAdding = true;
    this.isAddSubCancerTypeModal = true;
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
      const url  = this.cancerTypeService.getNextUrl();
      this.addModal.hide();
      if(this.routes.snapshot.paramMap.get('linkedId')) {
        this.ngOnInit();
      } else {
        this.route.navigateByUrl(url);
      }
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

}
