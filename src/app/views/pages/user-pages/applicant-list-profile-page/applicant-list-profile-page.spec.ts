import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantListProfilePage } from './applicant-list-profile-page';

describe('ApplicantListProfilePage', () => {
  let component: ApplicantListProfilePage;
  let fixture: ComponentFixture<ApplicantListProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicantListProfilePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantListProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
