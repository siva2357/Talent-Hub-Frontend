import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentProfilePage } from './talent-profile-page';

describe('TalentProfilePage', () => {
  let component: TalentProfilePage;
  let fixture: ComponentFixture<TalentProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalentProfilePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalentProfilePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
