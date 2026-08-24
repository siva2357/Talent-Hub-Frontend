import { Component, Input } from '@angular/core';

export type LoaderType =
  | 'spinner'
  | 'progress'
  | 'circular';

export type SpinnerVariant =
  | 'standard'
  | 'dotted'
  | 'thick'
  | 'track';

export type ProgressVariant =
  | 'standard'
  | 'striped'
  | 'animated'
  | 'handle';

export type CircularVariant =
  | 'thin'
  | 'md'
  | 'thick';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.html',
  styleUrl: './loader.css'
})
export class Loader {

  @Input() type: LoaderType = 'spinner';

  @Input() spinnerVariant: SpinnerVariant = 'standard';

  @Input() progressVariant: ProgressVariant = 'standard';

  @Input() circularVariant: CircularVariant = 'md';

  @Input() progress: number = 0;

  @Input() color: 'primary' | 'success' = 'primary';

  @Input() showPercentage: boolean = true;

  get safeProgress(): number {
    return Math.min(100, Math.max(0, this.progress));
  }

  get circularColor(): string {
    return this.color === 'success'
      ? '#10b981'
      : '#2563eb';
  }
}