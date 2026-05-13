import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyTalenthubComponent } from './why-talenthub.component';

describe('WhyTalenthubComponent', () => {
  let component: WhyTalenthubComponent;
  let fixture: ComponentFixture<WhyTalenthubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyTalenthubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyTalenthubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
