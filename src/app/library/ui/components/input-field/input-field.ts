import { Component, EventEmitter, Input, Output } from '@angular/core';

export type InputFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'date'
  | 'time'
  | 'tel'
  | 'textarea'
  | 'select'
  | 'multiselect';

export type InputValidation =
  | 'none'
  | 'success'
  | 'error';

export interface InputOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-input-field',
  standalone: true,
  templateUrl: './input-field.html',
  styleUrl: './input-field.css'
})
export class InputField {

  @Input() label: string = 'Email address';

  @Input() type: InputFieldType = 'text';

  @Input() placeholder: string = 'Enter email address';

  @Input() value: string = '';

  // Icon
  @Input() icon: string = 'bi bi-lock';

  @Input() showIcon: boolean = false;

  // Options
  @Input() options: InputOption[] = [];

  // States
  @Input() disabled: boolean = false;

  @Input() readonly: boolean = false;

  @Input() required: boolean = false;

  // Validation
  @Input() validation: InputValidation = 'none';

  @Input() errorMessage: string = '';

  @Input() successMessage: string = '';

  // Multi-select
  @Input() selectedValues: string[] = [];

  // Events
  @Output() valueChange = new EventEmitter<string>();

  @Output() selectedValuesChange = new EventEmitter<string[]>();

  @Output() changed = new EventEmitter<string>();

  @Output() blurred = new EventEmitter<void>();

  @Input() showPasswordToggle: boolean = false;
  isPasswordVisible: boolean = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  isDropdownOpen: boolean = false;

  onValueChange(event: Event): void {
    const target =
      event.target as HTMLInputElement | HTMLTextAreaElement;

    this.value = target.value;

    this.valueChange.emit(this.value);
    this.changed.emit(this.value);
  }

  onBlur(): void {
    this.blurred.emit();
  }

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;

    this.value = target.value;

    this.valueChange.emit(this.value);
    this.changed.emit(this.value);
  }

  toggleDropdown(): void {
    if (this.disabled || this.readonly) {
      return;
    }

    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleOption(option: InputOption): void {
    if (
      this.disabled ||
      this.readonly ||
      option.disabled
    ) {
      return;
    }

    const exists =
      this.selectedValues.includes(option.value);

    if (exists) {
      this.selectedValues =
        this.selectedValues.filter(
          value => value !== option.value
        );
    } else {
      this.selectedValues = [
        ...this.selectedValues,
        option.value
      ];
    }

    this.selectedValuesChange.emit(
      this.selectedValues
    );
  }

  isSelected(value: string): boolean {
    return this.selectedValues.includes(value);
  }

  get selectedLabels(): string {
    return this.options
      .filter(option =>
        this.selectedValues.includes(option.value)
      )
      .map(option => option.label)
      .join(', ');
  }

  get validationMessage(): string {
    if (this.validation === 'error') {
      return this.errorMessage;
    }

    if (this.validation === 'success') {
      return this.successMessage;
    }

    return '';
  }
}