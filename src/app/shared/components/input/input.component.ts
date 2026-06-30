import { Component, input, output, forwardRef, signal, computed } from '@angular/core';
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
  // Use model/signal for internal value to support ControlValueAccessor reactivity if needed, 
  // but a standard property works best for CVA interoperability without complex wrappers.
  value: any = ''; 
  
  type = input<'text' | 'email' | 'number' | 'password' | 'date' | 'datetime-local' | 'select' | 'multiselect' | 'textarea'>('text');
  label = input<string>('');
  placeholder = input<string>('');
  options = input<{ label: string, value: any }[]>([]);
  error = input<string | null>(null);
  mode = input<'form' | 'filter'>('form');
  icon = input<string>('');
  customClass = input<string>('');
  required = input<boolean>(false);
  
  // Note: disabled is managed by ControlValueAccessor setDisabledState as well
  disabled = input<boolean>(false);
  _internalDisabled = false;

  showPasswordToggle = input<boolean>(false);

  dropdownStateChange = output<boolean>();

  showPassword = false;
  dropdownOpen = false;
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
    this._internalDisabled = isDisabled;
  }

  get isDisabled(): boolean {
    return this.disabled() || this._internalDisabled;
  }

  handleInput(event: any): void {
    const val = event.target.value;
    this.value = val;
    this.onChange(val);
  }

  toggleDropdown(): void {
    if (!this.isDisabled) {
      this.dropdownOpen = !this.dropdownOpen;
      this.dropdownStateChange.emit(this.dropdownOpen);

      if (!this.dropdownOpen) {
        this.onTouched();
      }
    }
  }

  toggleOption(optionValue: any): void {
    if (this.type() !== 'multiselect') return;

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
    this.onTouched();
  }

  selectOption(optionValue: any): void {
    if (this.type() !== 'select') return;

    this.value = optionValue;

    this.onChange(this.value);
    this.onTouched();

    this.dropdownOpen = false;
    this.dropdownStateChange.emit(false);
  }

  getSelectedLabel(): string {
    const currentType = this.type();
    const currentOptions = this.options();
    const currentPlaceholder = this.placeholder();

    if (currentType === 'multiselect') {
      if (!Array.isArray(this.value) || this.value.length === 0) return currentPlaceholder || 'Select Categories';
      if (this.value.length === 1) {
        return currentOptions.find(opt => opt.value === this.value[0])?.label || this.value[0];
      }
      return `${this.value.length} Selected`;
    } else {
      if (!this.value) return currentPlaceholder || 'Select Option';
      return currentOptions.find(opt => opt.value === this.value)?.label || this.value;
    }
  }

  isSelected(optionValue: any): boolean {
    if (this.type() === 'multiselect' && Array.isArray(this.value)) {
      return this.value.includes(optionValue);
    }
    return this.value === optionValue;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get inputType(): string {
    if (this.type() === 'password' && this.showPassword) {
      return 'text';
    }
    return this.type();
  }
}
