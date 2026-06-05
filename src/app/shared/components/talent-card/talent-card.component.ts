import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TalentCardStat {
  value: string | number;
  label: string;
  hasStar?: boolean;
}

@Component({
  selector: 'app-talent-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './talent-card.component.html',
  styleUrl: './talent-card.component.css'
})
export class TalentCardComponent {
  @Input() name: string = '';
  @Input() avatar: string = '';
  @Input() location: string = '';
  @Input() role: string = '';
  @Input() performance: number = 0;
  @Input() performanceTier: string = '';
  @Input() skills: string[] = [];
  @Input() stats: TalentCardStat[] = [];
  @Input() statusClass: string = '';
  @Input() statusLabel: string = '';
  @Input() cardClass: string = '';

  @Output() nameClick = new EventEmitter<void>();

  onNameClick(): void {
    this.nameClick.emit();
  }
}
