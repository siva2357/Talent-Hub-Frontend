import { Component, EventEmitter, Input, Output } from '@angular/core';

type ChipVariant =
  | 'primary'
  | 'success'
  | 'danger'
  | 'warning';

type ChipMode =
  | 'subtle'
  | 'outline';

@Component({
  selector: 'app-chip',
  standalone: true,
  templateUrl: './chip.html',
  styleUrl: './chip.css'
})
export class Chip {

  @Input() label: string = 'chip';

  @Input() variant: ChipVariant = 'primary';

  @Input() mode: ChipMode = 'subtle';

  @Input() icon: string = '';

  @Input() showClose: boolean = false;

  @Input() dashed: boolean = false;

  @Input() disabled: boolean = false;

  @Output() clicked = new EventEmitter<Event>();

  @Output() removed = new EventEmitter<void>();


  onClick(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      return;
    }

    this.clicked.emit(event);
  }


  onRemove(event: Event): void {
    event.stopPropagation();

    if (this.disabled) {
      return;
    }

    this.removed.emit();
  }

}