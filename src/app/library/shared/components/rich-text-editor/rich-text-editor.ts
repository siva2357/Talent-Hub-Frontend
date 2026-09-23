import { Component, Input, Output, EventEmitter, forwardRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  template: `
    <div class="mb-3 w-100 rich-text-editor-container">
      <label *ngIf="label" class="form-label fw-semibold text-dark">{{ label }}</label>
      <div class="bg-white rounded-3 overflow-hidden border">
        <quill-editor 
          [(ngModel)]="value" 
          (ngModelChange)="onValueChange($event)"
          [placeholder]="placeholder"
          [style]="{height: height}">
        </quill-editor>
      </div>
    </div>
  `,
  styles: [`
    .rich-text-editor-container .ql-toolbar {
      border: none !important;
      border-bottom: 1px solid #dee2e6 !important;
      background-color: #f8f9fa;
      border-radius: 0.375rem 0.375rem 0 0;
    }
    .rich-text-editor-container .ql-container {
      border: none !important;
      font-family: inherit;
    }
    .rich-text-editor-container .ql-editor {
      min-height: 200px;
    }
  `],
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
  @Input() placeholder: string = 'Enter text here...';
  @Input() height: string = '200px';
  @Input() value: string = '';
  
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
  
  onValueChange(val: string) {
    this.value = val;
    this.valueChange.emit(val);
    this.onChange(val);
    this.onTouch();
  }
}
