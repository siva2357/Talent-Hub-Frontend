import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeRoomPage } from './practice-room-page';

describe('PracticeRoomPage', () => {
  let component: PracticeRoomPage;
  let fixture: ComponentFixture<PracticeRoomPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeRoomPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeRoomPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
