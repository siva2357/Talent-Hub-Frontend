import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountPages } from './account-pages';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

describe('AccountPages', () => {
  let component: AccountPages;
  let fixture: ComponentFixture<AccountPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountPages],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the account pages shell component', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a router-outlet', () => {
    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutlet).toBeTruthy();
  });
});
