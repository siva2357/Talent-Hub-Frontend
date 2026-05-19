import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractViewDetailsComponent } from './contract-view-details.component';

describe('ContractViewDetailsComponent', () => {
  let component: ContractViewDetailsComponent;
  let fixture: ComponentFixture<ContractViewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractViewDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
