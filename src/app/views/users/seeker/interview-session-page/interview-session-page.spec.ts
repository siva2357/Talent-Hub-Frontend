import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewSessionPage } from './interview-session-page';

describe('InterviewSessionPage', () => {
  let component: InterviewSessionPage;
  let fixture: ComponentFixture<InterviewSessionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewSessionPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewSessionPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
