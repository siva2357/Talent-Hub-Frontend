import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RichTextEditor } from './rich-text-editor';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RichTextEditor', () => {
  let component: RichTextEditor;
  let fixture: ComponentFixture<RichTextEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RichTextEditor],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RichTextEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the editor component', () => {
    expect(component).toBeTruthy();
    expect(component.value).toBe('');
    expect(component.required).toBeFalse();
    expect(component.validation).toBe('none');
  });

  it('should render label and required asterisk when required is true', () => {
    component.label = 'Issue Details';
    component.required = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const labelEl = compiled.querySelector('label');
    expect(labelEl?.textContent).toContain('Issue Details');
    const asterisk = compiled.querySelector('.text-danger');
    expect(asterisk?.textContent?.trim()).toBe('*');
  });

  it('should clean trailing asterisk from label and render red asterisk', () => {
    component.label = 'Issue Details *';
    component.required = false;
    fixture.detectChanges();

    expect(component.cleanLabel('Issue Details *')).toBe('Issue Details');
    expect(component.isFieldRequired).toBeTrue();

    const compiled = fixture.nativeElement as HTMLElement;
    const labelEl = compiled.querySelector('label');
    expect(labelEl?.textContent).toContain('Issue Details');
    const asterisk = compiled.querySelector('.text-danger');
    expect(asterisk?.textContent?.trim()).toBe('*');
  });

  it('should render error message when validation is error', () => {
    component.validation = 'error';
    component.errorMessage = 'Description is required';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const errorEl = compiled.querySelector('.text-danger.mt-1');
    expect(errorEl?.textContent).toContain('Description is required');
  });

  it('should implement ControlValueAccessor methods properly', () => {
    component.writeValue('<p>Hello world</p>');
    expect(component.value).toBe('<p>Hello world</p>');

    component.writeValue(null);
    expect(component.value).toBe('');

    let changedVal = '';
    let touched = false;
    component.registerOnChange((val: string) => { changedVal = val; });
    component.registerOnTouched(() => { touched = true; });

    component.setDisabledState(true);
    expect(component.disabled).toBeTrue();

    component.onValueChange('<p>Testing</p>');
    expect(changedVal).toBe('<p>Testing</p>');
    expect(touched).toBeTrue();
  });

  it('should normalize empty Quill content to empty string', () => {
    let emittedVal = 'initial';
    component.valueChange.subscribe(v => emittedVal = v);

    component.onValueChange('<p><br></p>');
    expect(component.value).toBe('');
    expect(emittedVal).toBe('');

    component.onValueChange('   ');
    expect(component.value).toBe('');
    expect(emittedVal).toBe('');
  });
});
