import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Badge } from '../../../ui/components/badge/badge';
import { Button } from '../../../ui/components/button/button';
import { MeetCardData } from '../../../../core/models/meet.model';
export type { MeetCardData };

@Component({
  selector: 'app-meet-card',
  standalone: true,
  imports: [CommonModule, Button, Badge],
  templateUrl: './meet-card.html',
  styleUrl: './meet-card.css'
})
export class MeetCard {

  @Input()
  interview!: MeetCardData;

  @Output()
  join = new EventEmitter<MeetCardData>();

  get statusVariant(): 'success' | 'primary' | 'info' | 'danger' | 'warning' | 'secondary' {
    switch (this.interview?.interview?.status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'upcoming':
        return 'primary';
      case 'scheduled':
        return 'info';
      case 'cancelled':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  get isCompleted(): boolean {
    return this.interview?.interview?.status?.toLowerCase() === 'completed';
  }

  /*
   * =========================================
   * DATE
   * =========================================
   */

  get formattedDate(): string {
    const date = this.interview?.interview?.date;
    if (!date) {
      return 'N/A';
    }
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  /*
   * =========================================
   * TIME
   * =========================================
   */

  get formattedTime(): string {
    if (this.interview?.interview?.time) {
      return this.interview.interview.time;
    }
    const date = this.interview?.interview?.date;
    if (!date) {
      return 'N/A';
    }
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  /*
   * =========================================
   * INITIALS
   * =========================================
   */

  getInitials(name: string): string {
    if (!name) {
      return '';
    }
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  /*
   * =========================================
   * JOIN MEETING
   * =========================================
   */

  onJoin(): void {
    const link = this.interview?.interview?.link?.trim();
    if (!link) {
      return;
    }

    const targetUrl = link.startsWith('http') ? link : `https://${link}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    this.join.emit(this.interview);
  }

}