import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetOtpVerificationPage } from './reset-otp-verification-page';

describe('ResetOtpVerificationPage', () => {
  let component: ResetOtpVerificationPage;
  let fixture: ComponentFixture<ResetOtpVerificationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetOtpVerificationPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetOtpVerificationPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
