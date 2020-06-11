import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RegimenDetailService} from '../../regimen-detail.service';
import {Level} from '../../models/regimen-detail';

@Component({
  selector: 'level-type',
  templateUrl: './level-types.component.html',
  styleUrls: ['./level-types.component.scss']
})
export class LevelTypesComponent{
  regimenLevels: Level[] = [];
  editedLevelsMap = new Map();
  deletedLevels: Level[] = [];

  isLoading: boolean = false;
  constructor(private regimenDetailService: RegimenDetailService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.regimenDetailService.getRegimenLevelTypes().subscribe((types) => {
      this.isLoading = false;
      this.regimenLevels = types;
    })
  }


  close() {
    this.regimenDetailService.displayLevelType.emit(false);
  }

  edit(regimenLevel: Level) {
    this.editedLevelsMap.set(regimenLevel.level, regimenLevel);
  }

  delete(regimenLevel: any, idx) {
    if (this.editedLevelsMap.get(regimenLevel.id)) {
      this.editedLevelsMap.delete(regimenLevel.id);
    }

    this.deletedLevels.push(...this.regimenLevels.splice(idx, 1));
  }

  submit() {
    this.isLoading = true;
    if (this.deletedLevels.length > 0) {
      this.regimenDetailService.deleteLevel(this.deletedLevels).subscribe(() => {
        if (this.editedLevelsMap.size > 0) {
          this.regimenDetailService.editLevel(Array.from(this.editedLevelsMap.values())).subscribe(() => {
            this.isLoading = false;
            this.close();
          })
        } else {
          this.close();
        }
      })
    } else {
      if (this.editedLevelsMap.size > 0) {
        this.regimenDetailService.editLevel(Array.from(this.editedLevelsMap.values())).subscribe(() => {
          this.isLoading = false;
          this.close();
        })
      }
    }
  }

  addNewLevel() {
    this.regimenLevels.push({id: undefined, level: ''})
  }

}
