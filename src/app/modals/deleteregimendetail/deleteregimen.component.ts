import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CancerTreeService} from "../../services/cancer-tree.service";

@Component({
  selector: 'app-deleteregimen',
  templateUrl: './deleteregimen.component.html',
  styleUrls: ['./deleteregimen.component.scss']
})
export class DeleteregimenComponent {
  @Output() yes = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() regimen: any;

  currentCancerTitle: String;
  currentCancerId: String;
  currentRegimenType: String;
  isOnCancerDetailPage: boolean;

  constructor(private router: Router,
              private routes: ActivatedRoute,
              private cancerTreeService: CancerTreeService) {
    this.currentCancerId = this.routes.snapshot.params["id"];
    this.currentRegimenType = this.routes.snapshot.params["regimenType"];

    this.isOnCancerDetailPage = !(this.currentCancerId == '0') || !!(this.currentRegimenType);

    if(this.isOnCancerDetailPage){
      this.currentCancerTitle = this.cancerTreeService.getCurrentCancer().title;
    }
  }

  okay() {
    this.yes.emit(this.regimen);
  }

  close(event) {
    this.cancel.emit(event);
  }

}
