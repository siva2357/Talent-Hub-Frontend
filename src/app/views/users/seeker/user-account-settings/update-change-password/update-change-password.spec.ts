import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateChangePassword } from './update-change-password';

describe('UpdateChangePassword', () => {
  let component: UpdateChangePassword;
  let fixture: ComponentFixture<UpdateChangePassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateChangePassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateChangePassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
