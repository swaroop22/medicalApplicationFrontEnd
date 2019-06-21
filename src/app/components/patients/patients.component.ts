import {Component, OnInit, ViewChild} from '@angular/core';
import {MenuItem, TreeNode} from 'primeng/api';
import {PatientsService} from '../../patients.service';
import {Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap';


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


  ngOnInit(): void {
  }

    constructor(private PatientsService: PatientsService, private route: Router) {
    this.getPatients();
    this.crumbs = [
      {label:'PATIENTTYPES',url: this.route.url}
    ];
  }

  showAddPatient() {
    this.isAddPatientModal = true;
  }

  getPatients() {
    const that = this;
    this.PatientsService.getPatients().subscribe(function (resp) {
      that.Patients = resp;
    }, function (error) {
      alert('Error in getting medicines');
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
    const that = this;
    this.PatientsService.addPatientTypes(event).subscribe(function (resp) {
      that.getPatients();
      that.addModal.hide();
    }, function (error) {
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
    const that = this;
    this.PatientsService.editPatientTypes(data).subscribe(function (resp) {
      that.getPatients();
      that.editModal.hide();
    }, function (error) {
      alert('Error to update medicine ' + data);
    });
  }

  delete(obj) {
    this.Patient = JSON.parse(JSON.stringify(obj));
    this.isDeleteModal = true;
  }

  deletePatientTypes(data){
    const that = this;
    this.PatientsService.deletePatientTypes(data.id).subscribe(function (resp) {
      that.getPatients();
      that.deleteModal.hide();
    }, function (error) {
      if(error._body.match('ConstraintViolationException')){
        alert('Please delete your CancerTypes before you this delete patient type');
        that.deleteModal.hide();
      }
      console.log();

    });
  }

}
