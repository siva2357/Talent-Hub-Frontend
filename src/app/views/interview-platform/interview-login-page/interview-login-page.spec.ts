import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewLoginPage } from './interview-login-page';

describe('InterviewLoginPage', () => {
  let component: InterviewLoginPage;
  let fixture: ComponentFixture<InterviewLoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewLoginPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewLoginPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
