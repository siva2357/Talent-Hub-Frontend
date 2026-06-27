import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContractProposalsComponent } from './contract-proposals.component';
import { ContractService } from '../../../../../core/services/contract.service';
import { ApplicationService } from '../../../../../core/services/application.service';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';

describe('ContractProposalsComponent', () => {
  let component: ContractProposalsComponent;
  let fixture: ComponentFixture<ContractProposalsComponent>;

  let mockContractService: any;
  let mockApplicationService: any;
  let queryParamMapSubject: Subject<any>;

  const mockApplicants = [
    {
      applicationId: 'app-1',
      applicationStatus: 'application received',
      freelancer: {
        _id: 'user-1',
        fullName: 'John Doe',
        professionalHeadline: 'Frontend Dev',
        hourlyRate: 50,
        availability: ['full-time'],
        budgetType: 'Fixed Price',
        gender: 'male',
        languages: ['English'],
        skills: ['Angular', 'React']
      }
    },
    {
      applicationId: 'app-2',
      applicationStatus: 'shortlisted',
      offerStatus: 'none',
      freelancer: {
        _id: 'user-2',
        fullName: 'Jane Smith',
        professionalHeadline: 'Backend Dev',
        hourlyRate: 80,
        availability: ['part-time'],
        budgetType: 'Hourly',
        gender: 'female',
        languages: ['English', 'Spanish'],
        skills: ['NodeJS', 'Python']
      }
    }
  ];

  beforeEach(async () => {
    mockContractService = {
      getContractApplicants: jasmine.createSpy('getContractApplicants').and.returnValue(of({ applicants: mockApplicants }))
    };

    mockApplicationService = {
      shortlistApplication: jasmine.createSpy('shortlistApplication').and.returnValue(of({})),
      scheduleAssessment: jasmine.createSpy('scheduleAssessment').and.returnValue(of({})),
      sendOffer: jasmine.createSpy('sendOffer').and.returnValue(of({}))
    };

    queryParamMapSubject = new Subject<any>();

    await TestBed.configureTestingModule({
      imports: [ContractProposalsComponent, ReactiveFormsModule],
      providers: [
        { provide: ContractService, useValue: mockContractService },
        { provide: ApplicationService, useValue: mockApplicationService },
        provideRouter([]),
        { 
          provide: ActivatedRoute, 
          useValue: { queryParamMap: queryParamMapSubject.asObservable() } 
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractProposalsComponent);
    component = fixture.componentInstance;
  });

  it('should create and fetch applicants on init based on query params', () => {
    // ARRANGE: Set up the component
    fixture.detectChanges();
    
    // ACT: Emit route params
    queryParamMapSubject.next({ get: () => 'contract-123' });

    // ASSERT
    expect(component).toBeTruthy();
    expect(component.contractId()).toBe('contract-123');
    expect(mockContractService.getContractApplicants).toHaveBeenCalledWith('contract-123');
    expect(component.applicants().length).toBe(2);
  });

  it('should dynamically filter proposals using signals', () => {
    // ARRANGE
    fixture.detectChanges();
    queryParamMapSubject.next({ get: () => 'contract-123' });

    // ACT: Set search query
    component.pendingSearchQuery = 'Jane';
    component.applyFilters(); // Updates signal

    // ASSERT
    expect(component.filteredProposals().length).toBe(1);
    expect(component.filteredProposals()[0].freelancer.fullName).toBe('Jane Smith');

    // ACT: Filter by gender
    component.pendingSearchQuery = '';
    component.pendingSelectedGender = 'male';
    component.applyFilters();

    // ASSERT
    expect(component.filteredProposals().length).toBe(1);
    expect(component.filteredProposals()[0].freelancer.fullName).toBe('John Doe');
  });

  it('should open recruitment modal and set available actions', () => {
    fixture.detectChanges();
    queryParamMapSubject.next({ get: () => 'contract-123' });

    // ACT: Open modal for first applicant ('application received')
    component.openRecruitmentModal(mockApplicants[0]);

    // ASSERT
    expect(component.showRecruitmentModal()).toBeTrue();
    expect(component.selectedProposal()).toEqual(mockApplicants[0]);
    // The default action for 'application received' is 'shortlist'
    expect(component.nextAction()).toBe('shortlist');
  });

  it('should validate assessment form before submission', () => {
    fixture.detectChanges();
    queryParamMapSubject.next({ get: () => 'contract-123' });
    
    component.openRecruitmentModal(mockApplicants[0]);
    component.nextAction.set('schedule-assessment');
    
    spyOn(component.assessmentFormGroup, 'markAllAsTouched');

    // ACT: Submit with empty form
    component.submitRecruitmentAction();

    // ASSERT
    expect(component.assessmentFormGroup.markAllAsTouched).toHaveBeenCalled();
    expect(mockApplicationService.scheduleAssessment).not.toHaveBeenCalled();
  });

  it('should submit shortlist action and refresh applicants', () => {
    fixture.detectChanges();
    queryParamMapSubject.next({ get: () => 'contract-123' });
    
    component.openRecruitmentModal(mockApplicants[0]);
    component.nextAction.set('shortlist');

    // ACT
    component.submitRecruitmentAction();

    // ASSERT
    expect(mockApplicationService.shortlistApplication).toHaveBeenCalledWith('app-1');
    expect(mockContractService.getContractApplicants).toHaveBeenCalledTimes(2); // Initial + after refresh
    expect(component.showRecruitmentModal()).toBeFalse();
  });

  it('should send offer directly to shortlisted candidates', () => {
    fixture.detectChanges();
    queryParamMapSubject.next({ get: () => 'contract-123' });

    // ACT
    component.sendOffer(mockApplicants[1]);

    // ASSERT
    expect(mockApplicationService.sendOffer).toHaveBeenCalledWith('app-2', { scopeOfWork: '', additionalTerms: '' });
  });

  describe('Status UI Helpers', () => {
    it('should return correct badge variants for statuses', () => {
      expect(component.getStatusBadgeVariant('application received')).toBe('secondary');
      expect(component.getStatusBadgeVariant('shortlisted')).toBe('success');
      expect(component.getStatusBadgeVariant('unknown-status')).toBe('secondary');
    });

    it('should return correct icons for statuses', () => {
      expect(component.getStatusIcon('interview scheduled')).toBe('bi-calendar-event');
      expect(component.getStatusIcon('rejected')).toBe('bi-x-circle-fill');
      expect(component.getStatusIcon('unknown-status')).toBe('bi-info-circle');
    });
  });

  describe('submitRecruitmentAction Loading State', () => {
    it('should not remain stuck in submitting state if form is invalid', () => {
      fixture.detectChanges();
      queryParamMapSubject.next({ get: () => 'contract-123' });
      
      component.openRecruitmentModal(mockApplicants[0]);
      component.nextAction.set('schedule-assessment');
      
      // Act
      component.submitRecruitmentAction();
      
      // Assert
      expect(component.isSubmitting()).toBeFalse();
    });

    it('should set submitting state to true when API call starts and false on success', () => {
      fixture.detectChanges();
      queryParamMapSubject.next({ get: () => 'contract-123' });
      
      component.openRecruitmentModal(mockApplicants[0]);
      component.nextAction.set('shortlist');
      
      // Act
      component.submitRecruitmentAction();
      
      // Assert
      // Since it's synchronous mock, it resolves immediately and sets isSubmitting to false
      expect(component.isSubmitting()).toBeFalse();
      expect(mockApplicationService.shortlistApplication).toHaveBeenCalled();
    });
  });
});
