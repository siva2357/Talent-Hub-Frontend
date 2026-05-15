import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';

// Register custom font sizes
const fontSizeStyle: any = Quill.import('attributors/style/size');
fontSizeStyle.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'];
Quill.register(fontSizeStyle, true);

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule, QuillModule, FormsModule],
  templateUrl: './rich-text-editor.component.html',
  styleUrl: './rich-text-editor.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    }
  ]
})
export class RichTextEditorComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Write something...';
  @Input() error: string | null = null;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;

  value: string = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
      
      [{ 'size': ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      
      ['clean'],                                         // remove formatting button
      ['link', 'image', 'video']                         // link and image, video
    ]
  };

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onContentChanged(event: any): void {
    this.value = event.html;
    this.onChange(this.value);
  }
}
