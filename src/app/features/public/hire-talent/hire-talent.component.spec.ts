import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HireTalentComponent } from './hire-talent.component';

describe('HireTalentComponent', () => {
  let component: HireTalentComponent;
  let fixture: ComponentFixture<HireTalentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HireTalentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HireTalentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
