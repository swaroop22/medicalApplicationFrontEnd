import {Component, ViewChild} from '@angular/core';
import {RegimenDetailService} from './regimen-detail.service';
import {CancerTreeService} from './services/cancer-tree.service';
import {PatientsService} from './patients.service';
import {ModalDirective} from 'ngx-bootstrap';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'app';
  displayLevelModal: boolean;
  isLoading: boolean = false;

  breadCrumbs: {title: string, link: string}[] = [];

  @ViewChild('addPatientModal') public addPatientModal: ModalDirective;

  constructor(private cancerTreeService: CancerTreeService,
              private patientsService: PatientsService,
              regimeDetailService: RegimenDetailService) {
    regimeDetailService.displayLevelType.subscribe(display => {
        this.displayLevelModal = display;
    });

    cancerTreeService.cancersUpdated.asObservable().subscribe(() => {
      this.breadCrumbs = [];

      if (cancerTreeService.parentCancers) {
        for(let i=0; i< cancerTreeService.parentCancers.length; i++) {
          const cancer = cancerTreeService.parentCancers[i];
          if (i === 0) {
            this.breadCrumbs.push({title: cancer.title, link: 'cancerTypes/' + cancerTreeService.parentCancers[i].patientType});
          } else {
            this.breadCrumbs.push({title: cancer.title, link: 'subCancers/' + cancerTreeService.parentCancers[i-1].id});
          }
        }
      }
    })
  }

  displayAddPatientModal(){
    this.addPatientModal.show();
  }

  addPerson(event) {
    this.isLoading = true;
    this.patientsService.addPatientTypes(event).subscribe( (resp) => {
      this.isLoading = false;
      this.addPatientModal.hide();
    }, (error) => {
      this.addPatientModal.hide();
      this.isLoading = false;
      alert('Adding Patient Failed' + event.firstName);
    });
  }
}
