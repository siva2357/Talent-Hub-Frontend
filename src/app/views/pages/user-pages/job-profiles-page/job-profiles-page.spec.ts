import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobProfilesPage } from './job-profiles-page';

describe('JobProfilesPage', () => {
  let component: JobProfilesPage;
  let fixture: ComponentFixture<JobProfilesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobProfilesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobProfilesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
