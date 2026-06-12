import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractProgressComponent } from './contract-progress.component';

describe('ContractProgressComponent', () => {
  let component: ContractProgressComponent;
  let fixture: ComponentFixture<ContractProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
