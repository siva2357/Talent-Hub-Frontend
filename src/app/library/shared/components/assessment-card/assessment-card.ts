import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Badge } from '../../../ui/components/badge/badge';
import { Button } from '../../../ui/components/button/button';
import { AssessmentCardData } from '../../../../core/models/job.model';

export type { AssessmentCardData };

@Component({
  selector: 'app-assessment-card',
  standalone: true,
  imports: [CommonModule, Badge, Button],
  templateUrl: './assessment-card.html',
  styleUrl: './assessment-card.css'
})
export class AssessmentCard {

  @Input() assessment: AssessmentCardData | null = null;

  @Output() startAssessment = new EventEmitter<AssessmentCardData>();
  @Output() markCompleted = new EventEmitter<AssessmentCardData>();

  getStatusVariant(status: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'expired':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  get formattedAssignedDate(): string {
    if (!this.assessment?.assignedDate) return 'N/A';
    return this.formatDate(this.assessment.assignedDate);
  }

  get formattedDueDate(): string {
    if (!this.assessment?.dueDate) return 'N/A';
    return this.formatDate(this.assessment.dueDate);
  }

  private formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  onStartAssessment(): void {
    if (!this.assessment) return;

    if (this.assessment.assessmentLink) {
      window.open(
        this.assessment.assessmentLink,
        '_blank',
        'noopener,noreferrer'
      );
    }

    this.startAssessment.emit(this.assessment);
  }

  onMarkCompleted(): void {
    if (!this.assessment) return;
    this.markCompleted.emit(this.assessment);
  }
}
