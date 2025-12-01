import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterRecruiterPage } from './register-recruiter-page';

describe('RegisterRecruiterPage', () => {
  let component: RegisterRecruiterPage;
  let fixture: ComponentFixture<RegisterRecruiterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterRecruiterPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterRecruiterPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
