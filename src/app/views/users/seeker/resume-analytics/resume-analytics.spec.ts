import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeAnalytics } from './resume-analytics';

describe('ResumeAnalytics', () => {
  let component: ResumeAnalytics;
  let fixture: ComponentFixture<ResumeAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeAnalytics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeAnalytics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
