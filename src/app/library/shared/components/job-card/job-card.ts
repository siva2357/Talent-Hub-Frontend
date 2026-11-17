import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Badge } from '../../../ui/components/badge/badge';
import { Button } from '../../../ui/components/button/button';
import { JobCardData } from '../../../../core/models/job.model';

export type { JobCardData };

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule, Badge, Button],
  templateUrl: './job-card.html',
  styleUrl: './job-card.css'
})
export class JobCard {

  @Input() job: JobCardData | null = null;

  @Output() viewDetails = new EventEmitter<JobCardData>();
  @Output() apply = new EventEmitter<JobCardData>();
  @Output() save = new EventEmitter<JobCardData>();

  onViewDetails(): void {
    if (!this.job) return;
    this.viewDetails.emit(this.job);
  }

  onApply(): void {
    if (!this.job) return;
    this.apply.emit(this.job);
  }

  onSave(): void {
    if (!this.job) return;
    this.save.emit(this.job);
  }

  get formattedPostedDate(): string {
    if (!this.job?.postedDate) return '';
    return this.formatDate(this.job.postedDate);
  }

  get formattedDeadline(): string {
    if (!this.job?.applicationDeadline) return '';
    return this.formatDate(this.job.applicationDeadline);
  }

  private formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
