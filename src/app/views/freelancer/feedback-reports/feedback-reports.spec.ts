import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackReports } from './feedback-reports';
import { FeedbackService } from '../../../core/services/feedback.service';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FeedbackReports', () => {
  let component: FeedbackReports;
  let fixture: ComponentFixture<FeedbackReports>;

  let mockFeedbackService: jasmine.SpyObj<FeedbackService>;

  const mockFeedbackData = {
    _id: '6ac89e6e8897886868e2fb89',
    contractId: '6ac0bc02b876f6aaf74ed6c7',
    clientId: {
      registrationDetails: {
        fullName: 'Siva Prasad Kurra'
      },
      _id: '6ac09dd5b3762e72f825d31a'
    },
    freelancerId: {
      registrationDetails: {
        fullName: 'Siva Prasad Kurra'
      },
      _id: '6ac0b6d199f226c558b854c9'
    },
    overallRating: 5.0,
    categories: {
      qualityOfWork: 'The freelancer delivered exceptional quality work that perfectly aligned with our specifications.',
      requirementsAndDeliverables: 'They demonstrated outstanding dedication to the project from day one.',
      communication: 'Communication was consistently clear, prompt, and highly professional.',
      timeliness: 'Every single milestone was delivered either on schedule or ahead of the agreed-upon deadlines.',
      behaviorAndProfessionalism: 'The freelancer maintained a highly respectful and collaborative attitude throughout.'
    },
    clientComments: 'Working with this freelancer was an absolute pleasure. They possess deep technical expertise.',
    pros: [
      'Excellent code quality',
      'fast turnaround time',
      'highly responsive',
      'proactive problem solving',
      'great communication skills'
    ],
    cons: [
      'Could provide slightly more detailed inline code documentation',
      'minor timezone overlap challenges'
    ],
    createdAt: '2026-10-09T07:57:34.571Z',
    updatedAt: '2026-10-09T07:57:34.571Z'
  };

  beforeEach(async () => {
    mockFeedbackService = jasmine.createSpyObj('FeedbackService', ['getFeedbackByContract']);

    mockFeedbackService.getFeedbackByContract.and.returnValue(of({
      success: true,
      feedback: structuredClone(mockFeedbackData)
    }));

    await TestBed.configureTestingModule({
      imports: [FeedbackReports],
      providers: [
        provideRouter([]),
        { provide: FeedbackService, useValue: mockFeedbackService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => key === 'id' ? '6ac0bc02b876f6aaf74ed6c7' : null
              }
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit & Data Fetching', () => {
    it('should fetch feedback successfully when contract id is provided in route', () => {
      expect(mockFeedbackService.getFeedbackByContract).toHaveBeenCalledWith('6ac0bc02b876f6aaf74ed6c7');
      expect(component.feedbackData).toEqual(mockFeedbackData);
      expect(component.isLoading).toBeFalse();
      expect(component.error).toBeNull();
    });

    it('should set error message when feedback API returns success false or no feedback', () => {
      component.feedbackData = null;
      mockFeedbackService.getFeedbackByContract.and.returnValue(of({
        success: false,
        feedback: null
      }));

      component.fetchFeedback();

      expect(component.feedbackData).toBeNull();
      expect(component.error).toBe('Feedback not found.');
      expect(component.isLoading).toBeFalse();
    });

    it('should handle API error gracefully when fetching feedback', () => {
      spyOn(console, 'error');
      mockFeedbackService.getFeedbackByContract.and.returnValue(throwError(() => new Error('Server error')));

      component.fetchFeedback();

      expect(console.error).toHaveBeenCalled();
      expect(component.error).toBe('Failed to load feedback or feedback does not exist.');
      expect(component.isLoading).toBeFalse();
    });

    it('should set error and stop loading when contract id is missing from route', () => {
      const emptyRoute = {
        snapshot: {
          paramMap: {
            get: () => null
          }
        }
      };
      const testComp = new FeedbackReports(emptyRoute as any, mockFeedbackService);
      testComp.ngOnInit();

      expect(testComp.contractId).toBe('');
      expect(testComp.error).toBe('No contract ID provided.');
      expect(testComp.isLoading).toBeFalse();
    });
  });

  describe('Client Metadata Helpers', () => {
    it('should return client full name when available', () => {
      expect(component.getClientName()).toBe('Siva Prasad Kurra');
    });

    it('should fallback to "Client" when clientId is missing', () => {
      component.feedbackData = {};
      expect(component.getClientName()).toBe('Client');
    });

    it('should return client initials', () => {
      expect(component.getClientInitials()).toBe('SP');
    });

    it('should fallback to "CL" for missing or default client name', () => {
      component.feedbackData = {};
      expect(component.getClientInitials()).toBe('CL');
    });

    it('should return category feedback by key', () => {
      const text = component.getCategoryFeedback('qualityOfWork');
      expect(text).toContain('The freelancer delivered exceptional quality work');
    });

    it('should return default message for missing category feedback', () => {
      const text = component.getCategoryFeedback('nonExistentKey');
      expect(text).toBe('No feedback provided for this category.');
    });
  });

  describe('Rating Text Helper (getOverallRatingText)', () => {
    it('should return "Excellent" for ratings 4.5 and above', () => {
      expect(component.getOverallRatingText(5.0)).toBe('Excellent');
      expect(component.getOverallRatingText(4.5)).toBe('Excellent');
    });

    it('should return "Very Good" for ratings between 4.0 and 4.4', () => {
      expect(component.getOverallRatingText(4.4)).toBe('Very Good');
      expect(component.getOverallRatingText(4.0)).toBe('Very Good');
    });

    it('should return "Good" for ratings between 3.0 and 3.9', () => {
      expect(component.getOverallRatingText(3.9)).toBe('Good');
      expect(component.getOverallRatingText(3.0)).toBe('Good');
    });

    it('should return "Needs Attention" for ratings between 2.0 and 2.9', () => {
      expect(component.getOverallRatingText(2.9)).toBe('Needs Attention');
      expect(component.getOverallRatingText(2.0)).toBe('Needs Attention');
    });

    it('should return "Poor" for ratings below 2.0', () => {
      expect(component.getOverallRatingText(1.9)).toBe('Poor');
      expect(component.getOverallRatingText(1.0)).toBe('Poor');
      expect(component.getOverallRatingText(0)).toBe('Poor');
    });
  });

  describe('Rating Color Class Helper (getOverallRatingColorClass)', () => {
    it('should return "text-success" for ratings 4.0 and above', () => {
      expect(component.getOverallRatingColorClass(5.0)).toBe('text-success');
      expect(component.getOverallRatingColorClass(4.0)).toBe('text-success');
    });

    it('should return "text-warning" for ratings between 3.0 and 3.9', () => {
      expect(component.getOverallRatingColorClass(3.5)).toBe('text-warning');
      expect(component.getOverallRatingColorClass(3.0)).toBe('text-warning');
    });

    it('should return "text-danger" for ratings below 3.0', () => {
      expect(component.getOverallRatingColorClass(2.9)).toBe('text-danger');
      expect(component.getOverallRatingColorClass(1.5)).toBe('text-danger');
    });
  });
});
