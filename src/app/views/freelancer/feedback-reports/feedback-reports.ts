import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FeedbackService } from '../../../core/services/feedback.service';

export interface FeedbackCategoryItem {
  key: string;
  title: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  description: string;
}

@Component({
  selector: 'app-feedback-reports',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './feedback-reports.html',
  styleUrl: './feedback-reports.css'
})
export class FeedbackReports implements OnInit {
  contractId: string = '';
  feedbackData: any = null;
  isLoading = true;
  error: string | null = null;

  categoriesConfig = [
    {
      key: 'qualityOfWork',
      title: 'Resolved Fully (Quality)',
      icon: 'bi-patch-check-fill',
      iconBg: 'bg-primary-subtle',
      iconColor: 'text-primary'
    },
    {
      key: 'requirementsAndDeliverables',
      title: 'Work Commitment',
      icon: 'bi-award-fill',
      iconBg: 'bg-success-subtle',
      iconColor: 'text-success'
    },
    {
      key: 'communication',
      title: 'Communication',
      icon: 'bi-chat-dots-fill',
      iconBg: 'bg-info-subtle',
      iconColor: 'text-info'
    },
    {
      key: 'timeliness',
      title: 'On-Time Delivery',
      icon: 'bi-clock-history',
      iconBg: 'bg-warning-subtle',
      iconColor: 'text-warning'
    },
    {
      key: 'behaviorAndProfessionalism',
      title: 'Professional Behavior',
      icon: 'bi-person-check-fill',
      iconBg: 'bg-purple-subtle',
      iconColor: 'text-purple'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private feedbackService: FeedbackService
  ) { }

  ngOnInit(): void {
    this.contractId = this.route.snapshot.paramMap.get('id') || '';
    if (this.contractId) {
      this.fetchFeedback();
    } else {
      this.error = "No contract ID provided.";
      this.isLoading = false;
    }
  }

  fetchFeedback(): void {
    this.isLoading = true;
    this.feedbackService.getFeedbackByContract(this.contractId).subscribe({
      next: (res) => {
        if (res.success && res.feedback) {
          this.feedbackData = res.feedback;
        } else {
          this.error = "Feedback not found.";
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = "Failed to load feedback or feedback does not exist.";
        this.isLoading = false;
      }
    });
  }

  getClientName(): string {
    return this.feedbackData?.clientId?.registrationDetails?.fullName || 'Client';
  }

  getClientInitials(): string {
    const name = this.getClientName();
    if (!name || name === 'Client') return 'CL';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getCategoryFeedback(key: string): string {
    if (!this.feedbackData?.categories) return 'No feedback provided for this category.';
    return this.feedbackData.categories[key] || 'No feedback provided for this category.';
  }

  getOverallRatingText(rating: number): string {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Very Good';
    if (rating >= 3.0) return 'Good';
    if (rating >= 2.0) return 'Needs Attention';
    return 'Poor';
  }

  getOverallRatingColorClass(rating: number): string {
    if (rating >= 4.5) return 'text-success';
    if (rating >= 4.0) return 'text-success';
    if (rating >= 3.0) return 'text-warning';
    if (rating >= 2.0) return 'text-danger';
    return 'text-danger';
  }
}
