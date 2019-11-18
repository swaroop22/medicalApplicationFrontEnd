import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RegimenDetailService} from '../../regimen-detail.service';

@Component({
  selector: 'level-type',
  templateUrl: './level-types.component.html',
  styleUrls: ['./level-types.component.scss']
})
export class LevelTypesComponent{
  private regimenLevels: any[];

  constructor(private regimenDetailService: RegimenDetailService) {
  }

  ngOnInit() {
    this.regimenDetailService.getRegimenLevelTypes().subscribe((types) => {
      this.regimenLevels = types;
    })
  }


  close() {
    this.regimenDetailService.displayLevelType.emit(false);
  }

  edit(regimenLevel: any) {

  }

  delete(regimenLevel: any) {
    this.regimenDetailService.deleteLevel(regimenLevel).subscribe(deleted => {
      this.ngOnInit();
    });
  }
}
