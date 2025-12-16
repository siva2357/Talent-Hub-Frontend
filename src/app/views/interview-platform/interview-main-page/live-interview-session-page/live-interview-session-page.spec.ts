import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInterviewSessionPage } from './live-interview-session-page';

describe('LiveInterviewSessionPage', () => {
  let component: LiveInterviewSessionPage;
  let fixture: ComponentFixture<LiveInterviewSessionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveInterviewSessionPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveInterviewSessionPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
