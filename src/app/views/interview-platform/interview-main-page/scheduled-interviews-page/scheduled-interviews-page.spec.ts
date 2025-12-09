import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledInterviewsPage } from './scheduled-interviews-page';

describe('ScheduledInterviewsPage', () => {
  let component: ScheduledInterviewsPage;
  let fixture: ComponentFixture<ScheduledInterviewsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduledInterviewsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledInterviewsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
