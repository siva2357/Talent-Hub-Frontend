import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobpostsApplicants } from './jobposts-applicants';

describe('JobpostsApplicants', () => {
  let component: JobpostsApplicants;
  let fixture: ComponentFixture<JobpostsApplicants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobpostsApplicants]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobpostsApplicants);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
