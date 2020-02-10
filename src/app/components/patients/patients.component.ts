import {Component, OnInit, ViewChild} from '@angular/core';
import {MenuItem, TreeNode} from 'primeng/api';
import {PatientsService} from '../../patients.service';
import {Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap';
import {CancerTypeService} from '../../cancer-type.service';
import {CANCERS} from '../../constants/constants';
import {CancerTree} from '../../state/CancerTree';
import {CancerTreeService} from '../../services/cancer-tree.service';


@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
/**
 * Patient component
 */
export class PatientsComponent implements OnInit {

  crumbs: MenuItem[];
  @ViewChild('addModal') public addModal: ModalDirective;
  @ViewChild('deleteModal') public deleteModal: ModalDirective;
  @ViewChild('editModal') public editModal: ModalDirective;
  public addPersonError = '';
  public Patient = {};
  errorMessage: string;

  public Patients: TreeNode[] = [];

  id: number;

  public isAddPatientModal = false;

  public isEditModal = false;
  public isDeleteModal = false;
  isLoading: boolean;


  ngOnInit(): void {
  }

    constructor(private PatientsService: PatientsService,
                private cancerTypeService: CancerTypeService,
                private cancerTree: CancerTreeService,
                private route: Router) {
    this.getPatients();
    this.crumbs = this.cancerTypeService.getBreadCrumbData();
    if(this.route.url.indexOf('cancerTypes')>=0) {
      this.route.navigateByUrl(this.route.url);
    }
  }

  showAddPatient() {
    this.isAddPatientModal = true;
  }

  getPatients() {
    this.isLoading = true;
    this.cancerTypeService.getPatients().subscribe((resp) => {
      this.isLoading = false;
      this.Patients = resp;
      this.crumbs = this.cancerTypeService.getBreadCrumbData();
    }, function (error) {
      this.isLoading = false
      alert('Error in getting Patients');
    });
  }

  onHide(event) {
    if (event === 'add') {
      this.isAddPatientModal = false;
    }  else if (event === 'edit') {
      this.isEditModal = false;
    } else if (event === 'delete') {
      this.isDeleteModal = false;
    }
  }

  addPerson(event) {
    this.isLoading = true;
    this.PatientsService.addPatientTypes(event).subscribe( (resp) => {
      this.isLoading = false;
      this.getPatients();
      this.addModal.hide();
    }, (error) => {
      this.isLoading = false;
      alert('Person add error ' + event.firstName);
    });
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

  edit(obj) {
    this.Patient = JSON.parse(JSON.stringify(obj));
    this.isEditModal = true;
  }

  editPatientTypes(data) {
    this.isLoading = true;
    this.PatientsService.editPatientTypes(data).subscribe( (resp) => {
      this.isLoading = false;
      this.getPatients();
      this.editModal.hide();
    },  (error) => {
      this.isLoading = false;
      alert('Error to updating patient ' + data);
    });
  }

  delete(obj) {
    this.Patient = JSON.parse(JSON.stringify(obj));
    this.isDeleteModal = true;
  }

  deletePatientTypes(data){
    this.isLoading = true;
    this.PatientsService.deletePatientTypes(data.id).subscribe((resp) => {
      this.isLoading = false;
      this.getPatients();
      this.deleteModal.hide();
    },  (error) => {
      this.isLoading = false;
      if(error._body.match('ConstraintViolationException')){
        alert('Please delete your CancerTypes before you this delete patient type');
        this.deleteModal.hide();
      }
      console.log();

    });
  }

  goToAllRegiments() {
    this.route.navigateByUrl('regimenDetails/0');
  }
}
