import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from "@angular/router";
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
  isOnCancerDetailPage: boolean;

  constructor(private router: Router,
              private cancerTreeService: CancerTreeService) {
    this.isOnCancerDetailPage = !(router.url || '').includes('regimenDetails');

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
