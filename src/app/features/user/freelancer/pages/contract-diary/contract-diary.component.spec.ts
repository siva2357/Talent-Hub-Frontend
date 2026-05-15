import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDiary } from './contract-diary';

describe('ContractDiary', () => {
  let component: ContractDiary;
  let fixture: ComponentFixture<ContractDiary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractDiary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractDiary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
