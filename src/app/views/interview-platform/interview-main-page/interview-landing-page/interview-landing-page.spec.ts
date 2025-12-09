import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewLandingPage } from './interview-landing-page';

describe('InterviewLandingPage', () => {
  let component: InterviewLandingPage;
  let fixture: ComponentFixture<InterviewLandingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewLandingPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewLandingPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
