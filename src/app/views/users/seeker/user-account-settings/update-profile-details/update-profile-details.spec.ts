import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileDetails } from './update-profile-details';

describe('UpdateProfileDetails', () => {
  let component: UpdateProfileDetails;
  let fixture: ComponentFixture<UpdateProfileDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProfileDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProfileDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
