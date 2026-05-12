import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyTalenthub } from './why-talenthub';

describe('WhyTalenthub', () => {
  let component: WhyTalenthub;
  let fixture: ComponentFixture<WhyTalenthub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyTalenthub]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyTalenthub);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
