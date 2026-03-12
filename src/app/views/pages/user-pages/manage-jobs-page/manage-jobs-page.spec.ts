import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJobsPage } from './manage-jobs-page';

describe('ManageJobsPage', () => {
  let component: ManageJobsPage;
  let fixture: ComponentFixture<ManageJobsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageJobsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageJobsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
