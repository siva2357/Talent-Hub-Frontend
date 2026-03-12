import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentMarketplacePage } from './talent-marketplace-page';

describe('TalentMarketplacePage', () => {
  let component: TalentMarketplacePage;
  let fixture: ComponentFixture<TalentMarketplacePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalentMarketplacePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalentMarketplacePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
