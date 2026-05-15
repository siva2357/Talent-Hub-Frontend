import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyWorkDiary } from './hourly-work-diary';

describe('HourlyWorkDiary', () => {
  let component: HourlyWorkDiary;
  let fixture: ComponentFixture<HourlyWorkDiary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HourlyWorkDiary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HourlyWorkDiary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
