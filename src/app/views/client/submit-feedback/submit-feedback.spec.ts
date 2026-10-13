import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubmitFeedback } from './submit-feedback';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackService } from '../../../core/services/feedback.service';
import { ContractService } from '../../../core/services/contract.service';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SubmitFeedback', () => {
  let component: SubmitFeedback;
  let fixture: ComponentFixture<SubmitFeedback>;
  let mockFeedbackService: jasmine.SpyObj<FeedbackService>;
  let mockContractService: jasmine.SpyObj<ContractService>;
  let router: Router;

  beforeEach(async () => {
    mockFeedbackService = jasmine.createSpyObj('FeedbackService', ['submitFeedback']);
    mockContractService = jasmine.createSpyObj('ContractService', ['getClientContractById']);

    mockContractService.getClientContractById.and.returnValue(of({
      success: true,
      contract: {
        _id: 'contract123',
        contractTitle: 'Test Contract',
        applicants: [{ freelancerId: { _id: 'freelancer123' } }]
      } as any
    }));

    mockFeedbackService.submitFeedback.and.returnValue(of({ success: true }));

    await TestBed.configureTestingModule({
      imports: [SubmitFeedback, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: FeedbackService, useValue: mockFeedbackService },
        { provide: ContractService, useValue: mockContractService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'contract123' } } }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitFeedback);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch contract details on init', () => {
    expect(mockContractService.getClientContractById).toHaveBeenCalledWith('contract123');
    expect(component.contractDetails).toBeTruthy();
    expect(component.freelancerId).toBe('freelancer123');
  });

  it('should initialize form with empty values', () => {
    expect(component.feedbackForm).toBeTruthy();
    expect(component.feedbackForm.get('qualityOfWork')?.value).toBe('');
    expect(component.feedbackForm.get('clientComments')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.feedbackForm.valid).toBeFalse();
  });

  it('should submit form when valid', () => {
    spyOn(window, 'alert');
    
    component.feedbackForm.patchValue({
      qualityOfWork: 'Great work',
      requirementsAndDeliverables: 'Committed',
      communication: 'Good',
      timeliness: 'On time',
      behaviorAndProfessionalism: 'Professional',
      clientComments: 'Amazing freelancer',
      pros: 'Fast',
      cons: 'None'
    });

    expect(component.feedbackForm.valid).toBeTrue();
    const navigateSpy = spyOn(router, 'navigate');
    component.submit();

    expect(mockFeedbackService.submitFeedback).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Feedback submitted successfully!');
    expect(navigateSpy).toHaveBeenCalledWith(['/manage-contract']);
  });

  it('should alert if form is invalid on submit', () => {
    spyOn(window, 'alert');
    component.submit();
    expect(window.alert).toHaveBeenCalledWith('Please provide an overall rating and fill out all required category ratings and comments.');
    expect(mockFeedbackService.submitFeedback).not.toHaveBeenCalled();
  });
});
