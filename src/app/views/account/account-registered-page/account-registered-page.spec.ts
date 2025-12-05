import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRegisteredPage } from './account-registered-page';

describe('AccountRegisteredPage', () => {
  let component: AccountRegisteredPage;
  let fixture: ComponentFixture<AccountRegisteredPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountRegisteredPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountRegisteredPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
