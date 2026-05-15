import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';


@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: 'text' | 'email' | 'password' | 'date' | 'select' | 'multiselect' | 'textarea' = 'text';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() options: { label: string, value: any }[] = []; // For select/multiselect
  @Input() error: string | null = null;
  @Input() mode: 'form' | 'filter' = 'form';
  @Input() icon: string = ''; // Bootstrap icon class
  @Input() customClass: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() showPasswordToggle: boolean = false;
  @Input() value: any = '';

  @Output() dropdownStateChange = new EventEmitter<boolean>();

  showPassword: boolean = false;
  dropdownOpen: boolean = false;
  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(value: any): void {
    this.value = value;
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

  handleInput(event: any): void {
    const val = event.target.value;
    this.value = val;
    this.onChange(val);
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      this.dropdownOpen = !this.dropdownOpen;
      this.dropdownStateChange.emit(this.dropdownOpen);
    }
  }

  toggleOption(optionValue: any): void {
    if (this.type !== 'multiselect') return;

    if (!Array.isArray(this.value)) {
      this.value = [];
    }

    const index = this.value.indexOf(optionValue);
    if (index > -1) {
      this.value.splice(index, 1);
    } else {
      this.value.push(optionValue);
    }

    this.onChange([...this.value]);
  }

  isSelected(optionValue: any): boolean {
    if (this.type === 'multiselect' && Array.isArray(this.value)) {
      return this.value.includes(optionValue);
    }
    return this.value === optionValue;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get inputType(): string {
    if (this.type === 'password' && this.showPassword) {
      return 'text';
    }
    return this.type;
  }
}
