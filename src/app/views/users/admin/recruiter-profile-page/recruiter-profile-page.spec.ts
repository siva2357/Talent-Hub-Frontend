import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterProfilePage } from './recruiter-profile-page';

describe('RecruiterProfilePage', () => {
  let component: RecruiterProfilePage;
  let fixture: ComponentFixture<RecruiterProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruiterProfilePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterProfilePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
