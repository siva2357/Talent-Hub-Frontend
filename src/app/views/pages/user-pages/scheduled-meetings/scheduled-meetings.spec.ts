import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledMeetings } from './scheduled-meetings';

describe('ScheduledMeetings', () => {
  let component: ScheduledMeetings;
  let fixture: ComponentFixture<ScheduledMeetings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduledMeetings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledMeetings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
