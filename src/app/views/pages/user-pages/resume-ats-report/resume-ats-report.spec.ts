import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeAtsReport } from './resume-ats-report';

describe('ResumeAtsReport', () => {
  let component: ResumeAtsReport;
  let fixture: ComponentFixture<ResumeAtsReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeAtsReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeAtsReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
