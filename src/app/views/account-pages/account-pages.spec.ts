import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPages } from './account-pages';

describe('AccountSection', () => {
  let component: AccountPages;
  let fixture: ComponentFixture<AccountPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountPages]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AccountPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
