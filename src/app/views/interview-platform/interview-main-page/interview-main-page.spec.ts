import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewMainPage } from './interview-main-page';

describe('InterviewMainPage', () => {
  let component: InterviewMainPage;
  let fixture: ComponentFixture<InterviewMainPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewMainPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewMainPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
