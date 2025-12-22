import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerProfileForm } from './seeker-profile-form';

describe('SeekerProfileForm', () => {
  let component: SeekerProfileForm;
  let fixture: ComponentFixture<SeekerProfileForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeekerProfileForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeekerProfileForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
