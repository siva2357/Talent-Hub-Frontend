import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractProposalsComponent } from './contract-proposals.component';

describe('ContractProposalsComponent', () => {
  let component: ContractProposalsComponent;
  let fixture: ComponentFixture<ContractProposalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractProposalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractProposalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
