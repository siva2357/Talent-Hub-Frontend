import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeAnalyzerReport } from './resume-analyzer-report';

describe('ResumeAnalyzerReport', () => {
  let component: ResumeAnalyzerReport;
  let fixture: ComponentFixture<ResumeAnalyzerReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeAnalyzerReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeAnalyzerReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
