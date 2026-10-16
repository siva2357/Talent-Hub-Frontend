import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerCard } from './ledger-card';

describe('LedgerCard', () => {
  let component: LedgerCard;
  let fixture: ComponentFixture<LedgerCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LedgerCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LedgerCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
