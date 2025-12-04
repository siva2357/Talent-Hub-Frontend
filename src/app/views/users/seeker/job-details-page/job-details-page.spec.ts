import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailsPage } from './job-details-page';

describe('JobDetailsPage', () => {
  let component: JobDetailsPage;
  let fixture: ComponentFixture<JobDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobDetailsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobDetailsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
