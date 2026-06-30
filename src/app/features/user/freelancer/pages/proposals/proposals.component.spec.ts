import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProposalsComponent } from './proposals.component';
import { ContractService } from '../../../../../core/services/contract.service';
import { ApplicationService } from '../../../../../core/services/application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { RouterTestingModule } from '@angular/router/testing';

describe('ProposalsComponent', () => {
  let component: ProposalsComponent;
  let fixture: ComponentFixture<ProposalsComponent>;
  let mockContractService: any;
  let mockApplicationService: any;
  let mockRoute: any;

  beforeEach(async () => {
    mockContractService = {
      getAppliedContracts: jasmine.createSpy('getAppliedContracts').and.returnValue(of({
        success: true,
        applications: [
          {
            applicationId: 'app1',
            contract: { _id: 'c1', contractTitle: 'Test Contract 1', estimatedBudget: 1000, budgetType: 'Fixed Price' },
            client: { fullName: 'Client One' },
            appliedAt: new Date().toISOString(),
            applicationStatus: 'applied'
          },
          {
            applicationId: 'app2',
            contract: { _id: 'c2', contractTitle: 'Test Contract 2', estimatedBudget: 50, budgetType: 'Hourly Rate' },
            client: { fullName: 'Client Two' },
            appliedAt: new Date().toISOString(),
            applicationStatus: 'shortlisted'
          }
        ]
      }))
    };

    mockApplicationService = {
      getFreelancerOffers: jasmine.createSpy('getFreelancerOffers').and.returnValue(of({
        success: true,
        offers: [
          { id: 'o1', contractTitle: 'Offer 1', status: 'Pending' }
        ]
      })),
      declineOffer: jasmine.createSpy('declineOffer').and.returnValue(of({})),
      submitAssessment: jasmine.createSpy('submitAssessment').and.returnValue(of({}))
    };

    mockRoute = {
      snapshot: { data: {} },
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [ProposalsComponent, RouterTestingModule],
      providers: [
        { provide: ContractService, useValue: mockContractService },
        { provide: ApplicationService, useValue: mockApplicationService },
        { provide: ActivatedRoute, useValue: mockRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProposalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load applied contracts by default', () => {
      expect(component.activeTab()).toBe('proposals');
      expect(mockContractService.getAppliedContracts).toHaveBeenCalled();
      expect(component.allProposals().length).toBe(2);
    });

    it('should compute appliedProposals correctly', () => {
      expect(component.appliedProposals().length).toBe(2);
    });
  });

  describe('Tab Switching', () => {
    it('should switch to offers and load them if empty', () => {
      component.switchTab('offers');
      expect(component.activeTab()).toBe('offers');
      expect(mockApplicationService.getFreelancerOffers).toHaveBeenCalled();
      expect(component.offers().length).toBe(1);
    });
  });

  describe('Filtering', () => {
    it('should filter by search query', () => {
      component.searchQuery.set('Contract 1');
      expect(component.appliedProposals().length).toBe(1);
      expect(component.appliedProposals()[0].contractTitle).toBe('Test Contract 1');
    });

    it('should clear search filter when removed from active filters', () => {
      component.searchQuery.set('Contract 1');
      expect(component.appliedProposals().length).toBe(1);
      
      const filter = component.activeFilters().find(f => f.id === 'search');
      if (filter) component.removeActiveFilter(filter);
      
      expect(component.searchQuery()).toBe('');
      expect(component.appliedProposals().length).toBe(2);
    });
    
    it('should reset all filters', () => {
      component.searchQuery.set('Test');
      component.statusFilter.set('Applied');
      
      component.resetAll();
      
      expect(component.searchQuery()).toBe('');
      expect(component.statusFilter()).toBe('All Status');
    });
  });

  describe('Actions', () => {
    it('should mark assessment completed and update signal', fakeAsync(() => {
      // Setup a proposal that needs an assessment
      component.allProposals.set([{
        id: 'app1',
        contractId: 'c1',
        contractTitle: 'Title',
        client: 'Client',
        date: 'date',
        budget: '100',
        budgetLabel: 'Amount',
        duration: '1 Month',
        contractType: 'Fixed Price',
        level: 'Intermediate',
        description: 'desc',
        status: 'Assessment Scheduled',
        type: 'Assignment',
        assessment: { title: 'Test Title', description: 'Test Description', date: '2025-01-01', status: 'scheduled' },
        interview: { title: 'Test Interview', description: 'desc', date: '2025-01-01', status: 'scheduled', feedback: '' }
      }]);
      
      component.markAssessmentCompleted('app1');
      
      expect(mockApplicationService.submitAssessment).toHaveBeenCalledWith('app1');
      expect(component.allProposals()[0].status).toBe('Assessment Completed');
      expect(component.allProposals()[0].assessment?.status).toBe('completed');
    }));

    it('should decline an offer and refetch', fakeAsync(() => {
      spyOn(window, 'confirm').and.returnValue(true);
      
      component.declineOffer('o1');
      
      expect(mockApplicationService.declineOffer).toHaveBeenCalledWith('o1');
      expect(mockApplicationService.getFreelancerOffers).toHaveBeenCalled(); // Initially, plus refetch
    }));
  });
});
