import {CancerTypeService} from '../../cancer-type.service';
import {ActivatedRoute, Router} from '@angular/router';
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
              private cancerTree: CancerTreeService,
              private subcancertypeService: SubcancertypeService,
              public subcancertypeService2: Subcancertype2Service,
              public subcancertypeService3: Subcancertype3Service) {
    this.crumbs = this.cancerTypeService.getBreadCrumbData();
  }

  ngOnInit() {
    this.addButtonName = this.cancerTree.nextItemToFetch();
    this.getCancerTypes();
  }

  getCancerTypes(){

    // const id = this.routes.snapshot.params["id"];
    //
    //
    // const typeToFetch = type || this.cancerTree.nextItemToFetch();

    this.cancerTypeService.getCancerTypes().subscribe( (resp) => {
      this.CancerTypes = resp;
      this.crumbs = this.cancerTypeService.getBreadCrumbData();

      if(this.CancerTypes.length === 0)
      {
        const latestItemAdded = this.cancerTypeService.getLatestItemAdded();
        this.route.navigateByUrl('regimenDetails/' + latestItemAdded);
      }
    }, (error) => {
      alert('Error in cancer types');
    });
  }

  showAddCancerType() {


    const type  =this.cancerTree.nextItemToFetch();

    if( type=== CANCERS.SUBCANCER || type === CANCERS.SUBCANCER2) {
      this.isAddSubCancerTypeModal = true;
      this.isAddCancerTypeModal = false;
    } else {
      this.isAddSubCancerTypeModal = false;
      this.isAddCancerTypeModal = true;
    }
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
    this.cancerTypeService.editCancerTypes(data, CANCERS.SUBCANCER1).subscribe(function (resp) {
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

    this.cancerTypeService.addId(event.previousId);
    this.cancerTypeService.addCancerTypes(event, CANCERS.SUBCANCER1).subscribe((resp) => {
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
    const type = this.cancerTree.nextItemToFetch();

    this.cancerTypeService.addId(id);

    const url = this.cancerTypeService.getNextUrl();
    this.route.navigateByUrl(url);

    // this.cancerTypeService.getCancerTypes(id, type).subscribe((resp) => {
    //   this.CancerTypes = resp;
    //
    //   this.crumbs = this.cancerTree.getBreadCrumbData();
    //
    //   if(this.CancerTypes.length === 0)
    //   {
    //     this.route.navigateByUrl('/regimenDetails/' + id);
    //   }
    // }, function (error) {
    //   alert('Error in getting SubCancer Types');
    // });
  }

}
