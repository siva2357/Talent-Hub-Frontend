import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiredTalents } from './hired-talents';

describe('HiredTalents', () => {
  let component: HiredTalents;
  let fixture: ComponentFixture<HiredTalents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiredTalents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiredTalents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
