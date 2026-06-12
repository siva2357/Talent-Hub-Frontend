import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveContracts } from './active-contracts';

describe('ActiveContracts', () => {
  let component: ActiveContracts;
  let fixture: ComponentFixture<ActiveContracts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveContracts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveContracts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
