import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FeedbackService } from '../../../core/services/feedback.service';
import { AIService } from '../../../core/services/ai.service';

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
  
  isAnalyzing: boolean = false;
  aiAnalysis: any = null;

  constructor(
    private route: ActivatedRoute,
    private feedbackService: FeedbackService,
    private aiService: AIService
  ) {}

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
          this.analyzeWithAI(); // Automatically trigger AI analysis
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

  analyzeWithAI(): void {
    if (!this.feedbackData) return;
    
    this.isAnalyzing = true;
    this.aiService.analyzeFeedback(this.feedbackData).subscribe({
      next: (res) => {
        if (res && res.result) {
          this.aiAnalysis = res.result;
        }
        this.isAnalyzing = false;
      },
      error: (err) => {
        console.error('AI Analysis failed:', err);
        this.isAnalyzing = false;
      }
    });
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
