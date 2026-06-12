import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiredTalentComponent } from './hired-talent.component';

describe('HiredTalentComponent', () => {
  let component: HiredTalentComponent;
  let fixture: ComponentFixture<HiredTalentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiredTalentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiredTalentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
