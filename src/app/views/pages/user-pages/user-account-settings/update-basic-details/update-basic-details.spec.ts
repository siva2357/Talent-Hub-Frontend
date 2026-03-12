import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBasicDetails } from './update-basic-details';

describe('UpdateBasicDetails', () => {
  let component: UpdateBasicDetails;
  let fixture: ComponentFixture<UpdateBasicDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateBasicDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateBasicDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
