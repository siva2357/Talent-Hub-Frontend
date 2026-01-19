import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentsRoomPage } from './assessments-room-page';

describe('AssessmentsRoomPage', () => {
  let component: AssessmentsRoomPage;
  let fixture: ComponentFixture<AssessmentsRoomPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentsRoomPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmentsRoomPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
