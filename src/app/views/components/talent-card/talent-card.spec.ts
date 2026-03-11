import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentCard } from './talent-card';

describe('TalentCard', () => {
  let component: TalentCard;
  let fixture: ComponentFixture<TalentCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalentCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalentCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
