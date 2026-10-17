import { Component, Input, Output, EventEmitter, forwardRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './rich-text-editor.html',
  styleUrl: './rich-text-editor.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditor),
      multi: true
    }
  ]
})
export class RichTextEditor implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() placeholder: string = 'Enter text here...';
  @Input() height: string = '200px';
  @Input() value: string = '';
  @Input() disabled: boolean = false;
  @Input() validation: 'none' | 'success' | 'error' = 'none';
  @Input() errorMessage: string = '';
  
  @Output() valueChange = new EventEmitter<string>();
  
  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(value: any): void {
    this.value = value || '';
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
  cleanLabel(label: string): string {
    if (!label) return '';
    return label.replace(/\s*\*+\s*$/, '').trim();
  }

  hasAsterisk(label: string): boolean {
    if (!label) return false;
    return /\*\s*$/.test(label.trim());
  }

  get isFieldRequired(): boolean {
    return this.required || this.hasAsterisk(this.label);
  }

  onValueChange(val: string) {
    const isQuillEmpty = !val || val === '<p><br></p>' || val.trim() === '';
    const cleanVal = isQuillEmpty ? '' : val;
    this.value = cleanVal;
    this.valueChange.emit(cleanVal);
    this.onChange(cleanVal);
    this.onTouch();
  }
}
