import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAssessments } from './manage-assessments';

describe('ManageAssessments', () => {
  let component: ManageAssessments;
  let fixture: ComponentFixture<ManageAssessments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageAssessments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAssessments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
