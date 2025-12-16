import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAssessmentPage } from './live-assessment-page';

describe('LiveAssessmentPage', () => {
  let component: LiveAssessmentPage;
  let fixture: ComponentFixture<LiveAssessmentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveAssessmentPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveAssessmentPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
