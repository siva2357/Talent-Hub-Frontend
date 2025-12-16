import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewMeetingPage } from './interview-meeting-page';

describe('InterviewMeetingPage', () => {
  let component: InterviewMeetingPage;
  let fixture: ComponentFixture<InterviewMeetingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewMeetingPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewMeetingPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
