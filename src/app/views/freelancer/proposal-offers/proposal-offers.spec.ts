import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProposalOffers } from './proposal-offers';
import { ContractService } from '../../../core/services/contract.service';
import { ApplicationService } from '../../../core/services/application.service';
import { OfferService } from '../../../core/services/offer.service';
import { MasterDataService } from '../../../core/services/master-data.service';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppliedContract } from '../../../core/models/application.model';

describe('ProposalOffers', () => {
  let component: ProposalOffers;
  let fixture: ComponentFixture<ProposalOffers>;

  let mockContractService: jasmine.SpyObj<ContractService>;
  let mockApplicationService: jasmine.SpyObj<ApplicationService>;
  let mockOfferService: jasmine.SpyObj<OfferService>;
  let mockMasterDataService: jasmine.SpyObj<MasterDataService>;

  const mockApplications: AppliedContract[] = [
    {
      applicationId: 'app-1',
      applicationStatus: 'applied',
      appliedAt: new Date().toISOString(),
      assessment: {
        description: 'https://test-assessment.com/task'
      },
      contract: {
        _id: 'c-1',
        contractTitle: 'Fullstack Angular Developer',
        estimatedBudget: 3000,
        contractDescription: 'Build enterprise application',
        contractStartDate: '2026-01-01',
        contractEndDate: '2026-06-01',
        contractType: 'fixed',
        contractSubject: 'Angular',
        createdAt: '2026-01-01'
      }
    },
    {
      applicationId: 'app-2',
      applicationStatus: 'assessment assigned',
      appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      contract: {
        _id: 'c-2',
        contractTitle: 'Node.js Backend Specialist',
        estimatedBudget: 2500,
        contractDescription: 'API development with Express',
        contractStartDate: '2026-02-01',
        contractEndDate: '2026-08-01',
        contractType: 'hourly',
        contractSubject: 'Node.js',
        createdAt: '2026-02-01'
      }
    }
  ];

  const mockOffers = [
    {
      id: 'offer-1',
      contractTitle: 'Angular Lead Consultant',
      client: 'Acme Corp',
      status: 'Pending',
      date: new Date().toISOString()
    },
    {
      id: 'offer-2',
      contractTitle: 'Python Data Engineer',
      client: 'DataTech Labs',
      status: 'Accepted',
      date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() // 40 days ago
    }
  ];

  beforeEach(async () => {
    mockContractService = jasmine.createSpyObj('ContractService', ['getAppliedContracts']);
    mockApplicationService = jasmine.createSpyObj('ApplicationService', ['submitAssessment']);
    mockOfferService = jasmine.createSpyObj('OfferService', ['getFreelancerOffers', 'declineOffer']);
    mockMasterDataService = jasmine.createSpyObj('MasterDataService', ['getMasterDataByCategory']);

    // Default mock returns
    mockMasterDataService.getMasterDataByCategory.and.callFake((category: string) => {
      if (category === 'ApplicationStatus') {
        return of({
          success: true,
          data: [
            { key: 'applied', value: 'Applied' },
            { key: 'assessment assigned', value: 'Assessment Assigned' }
          ]
        });
      }
      if (category === 'OfferStatus') {
        return of({
          success: true,
          data: [
            { key: 'Pending', value: 'Pending' },
            { key: 'Accepted', value: 'Accepted' }
          ]
        });
      }
      return of({ success: true, data: [] });
    });

    mockContractService.getAppliedContracts.and.returnValue(of({
      success: true,
      applications: structuredClone(mockApplications),
      totalApplications: mockApplications.length
    }));

    mockOfferService.getFreelancerOffers.and.returnValue(of({
      success: true,
      offers: structuredClone(mockOffers)
    }));

    await TestBed.configureTestingModule({
      imports: [ProposalOffers],
      providers: [
        provideRouter([]),
        { provide: ContractService, useValue: mockContractService },
        { provide: ApplicationService, useValue: mockApplicationService },
        { provide: OfferService, useValue: mockOfferService },
        { provide: MasterDataService, useValue: mockMasterDataService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProposalOffers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit & Initialization', () => {
    it('should fetch master data for ApplicationStatus and OfferStatus', () => {
      expect(mockMasterDataService.getMasterDataByCategory).toHaveBeenCalledWith('ApplicationStatus');
      expect(mockMasterDataService.getMasterDataByCategory).toHaveBeenCalledWith('OfferStatus');
      expect(component.proposalStatusOptions.length).toBe(3); // 'All Status' + 2 fetched
      expect(component.offerStatusOptions.length).toBe(3);
    });

    it('should fetch applied contracts and offers on init', () => {
      expect(mockContractService.getAppliedContracts).toHaveBeenCalled();
      expect(mockOfferService.getFreelancerOffers).toHaveBeenCalled();
      expect(component.applications.length).toBe(2);
      expect(component.totalApplications).toBe(2);
      expect(component.offers.length).toBe(2);
      expect(component.totalOffers).toBe(2);
      expect(component.isLoading).toBeFalse();
      expect(component.isLoadingOffers).toBeFalse();
    });

    it('should handle getAppliedContracts error gracefully', () => {
      spyOn(console, 'error');
      mockContractService.getAppliedContracts.and.returnValue(throwError(() => new Error('Contract error')));
      component.fetchAppliedContracts();
      expect(component.isLoading).toBeFalse();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle getFreelancerOffers error gracefully', () => {
      spyOn(console, 'error');
      mockOfferService.getFreelancerOffers.and.returnValue(throwError(() => new Error('Offer error')));
      component.fetchOffers();
      expect(component.isLoadingOffers).toBeFalse();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Tab Switching', () => {
    it('should toggle between proposals and offers tabs', () => {
      expect(component.activeTab).toBe('proposals');
      component.activeTab = 'offers';
      expect(component.activeTab).toBe('offers');
      component.activeTab = 'proposals';
      expect(component.activeTab).toBe('proposals');
    });
  });

  describe('Proposals Filtering & Search', () => {
    it('should filter proposals by search query', () => {
      component.searchQueryProposals = 'Angular';
      component.applyFiltersProposals();

      expect(component.applications.length).toBe(1);
      expect(component.applications[0].contract.contractTitle).toContain('Angular');
      expect(component.activeFiltersProposals).toEqual([
        { label: 'Search: Angular', type: 'search', value: 'Angular' }
      ]);
    });

    it('should filter proposals by status', () => {
      component.selectedStatusProposals = 'assessment assigned';
      component.applyFiltersProposals();

      expect(component.applications.length).toBe(1);
      expect(component.applications[0].applicationId).toBe('app-2');
    });

    it('should filter proposals by date range (7days)', () => {
      component.selectedDateRangeProposals = '7days';
      component.applyFiltersProposals();

      expect(component.applications.length).toBe(1);
      expect(component.applications[0].applicationId).toBe('app-1');
    });

    it('should reset proposals filters', () => {
      component.searchQueryProposals = 'Angular';
      component.selectedStatusProposals = 'applied';
      component.applyFiltersProposals();

      component.resetFiltersProposals();

      expect(component.searchQueryProposals).toBe('');
      expect(component.selectedStatusProposals).toBe('all');
      expect(component.selectedDateRangeProposals).toBe('all');
      expect(component.applications.length).toBe(2);
    });

    it('should remove specific filters for proposals', () => {
      component.searchQueryProposals = 'Angular';
      component.selectedStatusProposals = 'applied';
      component.selectedDateRangeProposals = '7days';
      component.applyFiltersProposals();

      component.removeFilterProposals({ label: 'Search: Angular', type: 'search', value: 'Angular' });
      expect(component.searchQueryProposals).toBe('');

      component.removeFilterProposals({ label: 'Status: Applied', type: 'status', value: 'applied' });
      expect(component.selectedStatusProposals).toBe('all');

      component.removeFilterProposals({ label: 'Date: Last 7 Days', type: 'date', value: '7days' });
      expect(component.selectedDateRangeProposals).toBe('all');
    });
  });

  describe('Offers Filtering & Search', () => {
    it('should filter offers by search query (client or contractTitle)', () => {
      component.searchQueryOffers = 'DataTech';
      component.applyFiltersOffers();

      expect(component.offers.length).toBe(1);
      expect(component.offers[0].id).toBe('offer-2');
    });

    it('should filter offers by status', () => {
      component.selectedStatusOffers = 'Pending';
      component.applyFiltersOffers();

      expect(component.offers.length).toBe(1);
      expect(component.offers[0].id).toBe('offer-1');
    });

    it('should filter offers by date range (30days)', () => {
      component.selectedDateRangeOffers = '30days';
      component.applyFiltersOffers();

      expect(component.offers.length).toBe(1);
      expect(component.offers[0].id).toBe('offer-1');
    });

    it('should reset offers filters', () => {
      component.searchQueryOffers = 'DataTech';
      component.applyFiltersOffers();

      component.resetFiltersOffers();

      expect(component.searchQueryOffers).toBe('');
      expect(component.selectedStatusOffers).toBe('all');
      expect(component.selectedDateRangeOffers).toBe('all');
      expect(component.offers.length).toBe(2);
    });

    it('should remove specific filters for offers', () => {
      component.searchQueryOffers = 'Acme';
      component.selectedStatusOffers = 'Pending';
      component.selectedDateRangeOffers = '7days';
      component.applyFiltersOffers();

      component.removeFilterOffers({ label: 'Search: Acme', type: 'search', value: 'Acme' });
      expect(component.searchQueryOffers).toBe('');

      component.removeFilterOffers({ label: 'Status: Pending', type: 'status', value: 'Pending' });
      expect(component.selectedStatusOffers).toBe('all');

      component.removeFilterOffers({ label: 'Date: Last 7 Days', type: 'date', value: '7days' });
      expect(component.selectedDateRangeOffers).toBe('all');
    });
  });

  describe('Offer & Application Actions', () => {
    it('should decline an offer and update its status locally', () => {
      mockOfferService.declineOffer.and.returnValue(of({ success: true, message: 'Offer declined' }));

      component.rejectOffer('offer-1');

      expect(mockOfferService.declineOffer).toHaveBeenCalledWith('offer-1');
      const offer = component.offers.find(o => o.id === 'offer-1');
      expect(offer?.status).toBe('Declined');
    });

    it('should handle error when declining offer', () => {
      spyOn(console, 'error');
      mockOfferService.declineOffer.and.returnValue(throwError(() => new Error('Decline failed')));

      component.rejectOffer('offer-1');

      expect(console.error).toHaveBeenCalled();
    });

    it('should submit assessment and update application status locally', () => {
      mockApplicationService.submitAssessment.and.returnValue(of({ success: true, message: 'Submitted' }));

      component.markAssessmentCompleted('app-1');

      expect(mockApplicationService.submitAssessment).toHaveBeenCalledWith('app-1', {
        score: null,
        notes: 'Assessment completed by freelancer.'
      });
      const app = component.applications.find(a => a.applicationId === 'app-1');
      expect(app?.applicationStatus).toBe('assessment completed');
    });

    it('should handle error when submitting assessment', () => {
      spyOn(console, 'error');
      mockApplicationService.submitAssessment.and.returnValue(throwError(() => new Error('Submit failed')));

      component.markAssessmentCompleted('app-1');

      expect(console.error).toHaveBeenCalled();
    });

    it('should open external link when assessment description contains URL', () => {
      spyOn(window, 'open');
      component.startAssessment('app-1');
      expect(window.open).toHaveBeenCalledWith('https://test-assessment.com/task', '_blank');
    });

    it('should log message if no external link in assessment', () => {
      spyOn(console, 'log');
      component.startAssessment('app-2');
      expect(console.log).toHaveBeenCalledWith('No external link provided in assessment description.');
    });

    it('should log when joining interview', () => {
      spyOn(console, 'log');
      component.joinInterview('app-1');
      expect(console.log).toHaveBeenCalledWith('Joining interview for application: app-1');
    });
  });

  describe('UI & Status Helpers', () => {
    it('should return correct badge variants for statuses', () => {
      expect(component.getStatusBadgeVariant('hired')).toBe('success');
      expect(component.getStatusBadgeVariant('application submitted')).toBe('warning');
      expect(component.getStatusBadgeVariant('shortlisted')).toBe('warning');
      expect(component.getStatusBadgeVariant('interview scheduled')).toBe('primary');
      expect(component.getStatusBadgeVariant('assessment assigned')).toBe('info');
      expect(component.getStatusBadgeVariant('rejected')).toBe('danger');
      expect(component.getStatusBadgeVariant('unknown status')).toBe('secondary');
    });

    it('should return correct progress bar widths', () => {
      expect(component.getProgressWidth('hired')).toBe('100%');
      expect(component.getProgressWidth('rejected')).toBe('100%');
      expect(component.getProgressWidth('offer sent')).toBe('85%');
      expect(component.getProgressWidth('interview scheduled')).toBe('66%');
      expect(component.getProgressWidth('assessment assigned')).toBe('33%');
      expect(component.getProgressWidth('shortlisted')).toBe('15%');
      expect(component.getProgressWidth('applied')).toBe('0%');
    });

    it('should generate timeline steps correctly', () => {
      const steps = component.getTimelineSteps(mockApplications[0]);
      expect(steps.length).toBe(4);
      expect(steps[0].title).toBe('Applied');
      expect(steps[0].status).toBe('completed');
      expect(steps[1].title).toBe('Assessment');
      expect(steps[2].title).toBe('Interview');
      expect(steps[3].title).toBe('Decision');
    });

    it('should identify active/done status checks', () => {
      expect(component.isAssessmentActive('assessment assigned')).toBeTrue();
      expect(component.isAssessmentDone('assessment completed')).toBeTrue();
      expect(component.isInterviewActive('interview scheduled')).toBeTrue();
      expect(component.isInterviewDone('interview completed')).toBeTrue();
      expect(component.isDecisionActive('hired')).toBeTrue();
    });
  });

  describe('Lifecycle Cleanup', () => {
    it('should unsubscribe all subscriptions on destroy', () => {
      spyOn((component as any).subscriptions, 'unsubscribe');
      component.ngOnDestroy();
      expect((component as any).subscriptions.unsubscribe).toHaveBeenCalled();
    });
  });
});
