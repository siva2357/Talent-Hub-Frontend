import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractProfile } from './contract-profile';

describe('ContractProfile', () => {
  let component: ContractProfile;
  let fixture: ComponentFixture<ContractProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
