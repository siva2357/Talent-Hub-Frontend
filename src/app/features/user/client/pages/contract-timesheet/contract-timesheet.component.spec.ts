import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractTimesheetComponent } from './contract-timesheet.component';

describe('ContractTimesheetComponent', () => {
  let component: ContractTimesheetComponent;
  let fixture: ComponentFixture<ContractTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractTimesheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
