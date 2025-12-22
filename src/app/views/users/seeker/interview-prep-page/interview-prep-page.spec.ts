import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewPrepPage } from './interview-prep-page';

describe('InterviewPrepPage', () => {
  let component: InterviewPrepPage;
  let fixture: ComponentFixture<InterviewPrepPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewPrepPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewPrepPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
