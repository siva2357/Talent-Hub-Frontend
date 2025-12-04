import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplicantsList } from './job-applicants-list';

describe('JobApplicantsList', () => {
  let component: JobApplicantsList;
  let fixture: ComponentFixture<JobApplicantsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobApplicantsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobApplicantsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
