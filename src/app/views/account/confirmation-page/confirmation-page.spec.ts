import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationPage } from './confirmation-page';

describe('ConfirmationPage', () => {
  let component: ConfirmationPage;
  let fixture: ComponentFixture<ConfirmationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
