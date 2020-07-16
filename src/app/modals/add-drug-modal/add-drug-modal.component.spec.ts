import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDrugModalComponent } from './add-drug-modal.component';

describe('AddDrugModalComponent', () => {
  let component: AddDrugModalComponent;
  let fixture: ComponentFixture<AddDrugModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDrugModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDrugModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
