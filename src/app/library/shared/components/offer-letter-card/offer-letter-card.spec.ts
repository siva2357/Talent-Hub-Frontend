import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferLetterCard } from './offer-letter-card';

describe('OfferLetterCard', () => {
  let component: OfferLetterCard;
  let fixture: ComponentFixture<OfferLetterCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferLetterCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferLetterCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
