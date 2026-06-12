import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindContractsComponent } from './find-contracts';

describe('FindWork', () => {
  let component: FindContracts;
  let fixture: ComponentFixture<FindContracts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindContracts]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FindContracts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
