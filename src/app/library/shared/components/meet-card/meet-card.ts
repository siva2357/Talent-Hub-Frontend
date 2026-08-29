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
export type {  MeetCardData  };


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
  join =
    new EventEmitter<MeetCardData>();


  /*
   * =========================================
   * =========================================
   * DESCRIPTION
   * =========================================
   */

  getStatusVariant(status: string): any {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'upcoming': return 'primary';
      case 'scheduled': return 'info';
      case 'cancelled': return 'danger';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  }

  get cleanDescription(): string {

    const description =
      this.interview?.interview?.description ?? '';

    return description
      .replace(/https?:\/\/\S+/gi, '')
      .replace(/^Join link:\s*/i, '')
      .trim();

  }


  /*
   * =========================================
   * MEETING LINK
   * =========================================
   */

  get meetingLink(): string {

    const description =
      this.interview?.interview?.description ?? '';

    const match =
      description.match(/https?:\/\/\S+/i);

    return match?.[0] ?? '';

  }


  /*
   * =========================================
   * DATE
   * =========================================
   */

  get formattedDate(): string {

    const date =
      this.interview?.interview?.date;

    if (!date) {
      return 'N/A';
    }

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }


  /*
   * =========================================
   * TIME
   * =========================================
   */

  get formattedTime(): string {

    const date =
      this.interview?.interview?.date;

    if (!date) {
      return 'N/A';
    }

    return new Date(date).toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    );

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
      .map(
        part => part.charAt(0).toUpperCase()
      )
      .join('');

  }





  /*
   * =========================================
   * JOIN MEETING
   * =========================================
   */

  onJoin(): void {

    if (!this.meetingLink) {
      return;
    }

    window.open(
      this.meetingLink,
      '_blank',
      'noopener,noreferrer'
    );

    this.join.emit(
      this.interview
    );

  }

}