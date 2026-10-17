import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputField } from './input-field';

describe('InputField', () => {
  let component: InputField;
  let fixture: ComponentFixture<InputField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render red asterisk when required is true', () => {
    component.label = 'Email Address';
    component.required = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('.form-label');
    expect(label?.textContent).toContain('Email Address');
    const asterisk = compiled.querySelector('.form-label .text-danger');
    expect(asterisk).toBeTruthy();
    expect(asterisk?.textContent?.trim()).toBe('*');
  });

  it('should strip trailing asterisk from label string and render red asterisk', () => {
    component.label = 'Full Name *';
    component.required = false;
    fixture.detectChanges();

    expect(component.cleanLabel('Full Name *')).toBe('Full Name');
    expect(component.isFieldRequired).toBeTrue();

    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('.form-label');
    expect(label?.textContent).toContain('Full Name');
    const asterisk = compiled.querySelector('.form-label .text-danger');
    expect(asterisk).toBeTruthy();
    expect(asterisk?.textContent?.trim()).toBe('*');
  });

  it('should not render asterisk when field is not required and has no asterisk', () => {
    component.label = 'Optional Note';
    component.required = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const asterisk = compiled.querySelector('.form-label .text-danger');
    expect(asterisk).toBeNull();
  });
});
