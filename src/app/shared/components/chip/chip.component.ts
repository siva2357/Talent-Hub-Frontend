import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.css'
})
export class ChipComponent {
  label = input<string>('');
  removable = input<boolean>(true);
  variant = input<'primary' | 'secondary' | 'outline'>('primary');
  
  remove = output<void>();

  onRemove() {
    if (this.removable()) {
      this.remove.emit();
    }
  }
}
