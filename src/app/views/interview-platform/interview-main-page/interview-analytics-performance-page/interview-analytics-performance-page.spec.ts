import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewAnalyticsPerformancePage } from './interview-analytics-performance-page';

describe('InterviewAnalyticsPerformancePage', () => {
  let component: InterviewAnalyticsPerformancePage;
  let fixture: ComponentFixture<InterviewAnalyticsPerformancePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewAnalyticsPerformancePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewAnalyticsPerformancePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
