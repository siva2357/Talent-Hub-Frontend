import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.css'
})
export class ChipComponent {
  @Input() label: string = '';
  @Input() removable: boolean = true;
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  
  @Output() remove = new EventEmitter<void>();

  onRemove() {
    if (this.removable) {
      this.remove.emit();
    }
  }
}
