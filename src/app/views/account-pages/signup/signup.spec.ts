import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Signup } from './signup';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signup],
      providers: [
        provideRouter([])
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with selectedRole as null', () => {
    expect(component.selectedRole).toBeNull();
  });

  it('should select client role', () => {
    component.selectRole('client');
    expect(component.selectedRole).toBe('client');
  });

  it('should select freelancer role', () => {
    component.selectRole('freelancer');
    expect(component.selectedRole).toBe('freelancer');
  });

  it('should not navigate on continue if no role is selected', () => {
    component.selectedRole = null;
    component.continue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to /register with role query param when client is selected', () => {
    component.selectRole('client');
    component.continue();

    expect(router.navigate).toHaveBeenCalledWith(['/register'], {
      queryParams: { role: 'client' }
    });
  });

  it('should navigate to /register with role query param when freelancer is selected', () => {
    component.selectRole('freelancer');
    component.continue();

    expect(router.navigate).toHaveBeenCalledWith(['/register'], {
      queryParams: { role: 'freelancer' }
    });
  });

  it('should handle card clicks in template', () => {
    const cards = fixture.nativeElement.querySelectorAll('.role-card');
    expect(cards.length).toBe(2);

    cards[0].click();
    fixture.detectChanges();
    expect(component.selectedRole).toBe('client');

    cards[1].click();
    fixture.detectChanges();
    expect(component.selectedRole).toBe('freelancer');
  });
});
