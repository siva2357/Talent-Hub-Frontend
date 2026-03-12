import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfessionalDetails } from './update-professional-details';

describe('UpdateProfessionalDetails', () => {
  let component: UpdateProfessionalDetails;
  let fixture: ComponentFixture<UpdateProfessionalDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProfessionalDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProfessionalDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
