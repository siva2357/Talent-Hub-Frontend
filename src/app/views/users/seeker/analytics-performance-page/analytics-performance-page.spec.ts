import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsPerformancePage } from './analytics-performance-page';

describe('AnalyticsPerformancePage', () => {
  let component: AnalyticsPerformancePage;
  let fixture: ComponentFixture<AnalyticsPerformancePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsPerformancePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsPerformancePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
