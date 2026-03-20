import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-fields',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './input-fields.html',
  styleUrl: './input-fields.css',
})
export class InputFields {
  @Input() form!: FormGroup;   // ✅ ADD THIS
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() controlName!: string;
  @Input() isSelect: boolean = false;
  @Input() options: string[] = [];
@Input() height: string = ''; // optional
@Input() isTextarea: boolean = false;
  getControl() {
  return this.form.get(this.controlName);
}

isInvalid(): boolean {
  const control = this.getControl();
  return !!(control && control.touched && control.invalid);
}

getErrorMessage(): string {
  const control = this.getControl();

  if (!control || !control.errors) return '';

  if (control.errors['required']) {
    return `${this.placeholder} is required`;
  }

  if (control.errors['email']) {
    return 'Enter a valid email';
  }

  if (control.errors['minlength']) {
    return `Minimum ${control.errors['minlength'].requiredLength} characters required`;
  }

  return 'Invalid field';
}

}
