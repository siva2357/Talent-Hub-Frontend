import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyTalentHub } from './why-talent-hub';

describe('WhyTalentHub', () => {
  let component: WhyTalentHub;
  let fixture: ComponentFixture<WhyTalentHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyTalentHub]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyTalentHub);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
