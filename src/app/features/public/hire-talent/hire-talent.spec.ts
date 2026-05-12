import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HireTalent } from './hire-talent';

describe('HireTalent', () => {
  let component: HireTalent;
  let fixture: ComponentFixture<HireTalent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HireTalent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HireTalent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
