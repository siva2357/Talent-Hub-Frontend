import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MyContracts } from './my-contracts';
import { ContractService } from '../../../core/services/contract.service';
import { MasterDataService } from '../../../core/services/master-data.service';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MyContracts', () => {
  let component: MyContracts;
  let fixture: ComponentFixture<MyContracts>;

  let mockContractService: jasmine.SpyObj<ContractService>;
  let mockMasterDataService: jasmine.SpyObj<MasterDataService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockContractsData = [
    {
      _id: 'c-1',
      contractTitle: 'Frontend Angular Overhaul',
      clientName: 'Tech Innovators Inc',
      contractCategory: 'web-dev',
      status: 'in progress',
      startDate: '2026-01-01',
      endDate: '2026-06-01',
      budget: 3500
    },
    {
      _id: 'c-2',
      contractTitle: 'Mobile App Wireframing',
      clientName: 'Studio Blue',
      contractCategory: 'design',
      status: 'open',
      startDate: '2026-02-01',
      endDate: '2026-02-15',
      budget: 1200
    },
    {
      _id: 'c-3',
      contractTitle: 'API Gateway Microservices',
      clientName: 'Cloud Solutions',
      contractCategory: 'backend',
      status: 'completed',
      startDate: '2025-06-01',
      endDate: '2025-12-01',
      budget: 5000
    },
    {
      _id: 'c-4',
      contractTitle: 'Legacy Code Migration',
      clientName: 'Enterprise Corp',
      contractCategory: 'backend',
      status: 'closed',
      startDate: '2025-01-01',
      endDate: '2025-04-01',
      budget: 4000
    }
  ];

  beforeEach(async () => {
    mockContractService = jasmine.createSpyObj('ContractService', ['getFreelancerMyContracts']);
    mockMasterDataService = jasmine.createSpyObj('MasterDataService', ['getMasterDataByCategory']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockMasterDataService.getMasterDataByCategory.and.returnValue(of({
      success: true,
      data: [
        { key: 'web-dev', value: 'Web Development' },
        { key: 'design', value: 'Design' },
        { key: 'backend', value: 'Backend Development' }
      ]
    }));

    mockContractService.getFreelancerMyContracts.and.returnValue(of({
      success: true,
      contracts: structuredClone(mockContractsData)
    }));

    await TestBed.configureTestingModule({
      imports: [MyContracts],
      providers: [
        provideRouter([]),
        { provide: ContractService, useValue: mockContractService },
        { provide: MasterDataService, useValue: mockMasterDataService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spyOn(mockRouter, 'navigate');

    fixture = TestBed.createComponent(MyContracts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit & Initialization', () => {
    it('should fetch master data categories on init', () => {
      expect(mockMasterDataService.getMasterDataByCategory).toHaveBeenCalledWith('ContractCategories');
      expect(component.categoryOptions.length).toBe(4); // 'All Categories' + 3 fetched
      expect(component.categoryOptions[1]).toEqual({ label: 'Web Development', value: 'web-dev' });
    });

    it('should fetch contracts and partition into active and completed contracts', () => {
      expect(mockContractService.getFreelancerMyContracts).toHaveBeenCalled();
      expect(component.activeContracts.length).toBe(2);
      expect(component.completedContracts.length).toBe(2);
      expect(component.isLoading).toBeFalse();
    });

    it('should handle error when fetching freelancer contracts gracefully', () => {
      spyOn(console, 'error');
      mockContractService.getFreelancerMyContracts.and.returnValue(throwError(() => new Error('API failure')));
      component.fetchMyContracts();

      expect(component.isLoading).toBeFalse();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit & Columns', () => {
    it('should populate columns after view init', fakeAsync(() => {
      component.ngAfterViewInit();
      tick();

      expect(component.columns.length).toBe(6);
      expect(component.columns[0].field).toBe('contractTitle');
      expect(component.columns[1].field).toBe('clientName');
      expect(component.columns[2].field).toBe('duration');
      expect(component.columns[3].field).toBe('budget');
      expect(component.columns[4].field).toBe('status');
      expect(component.columns[5].field).toBe('actions');
    }));
  });

  describe('Tab Switching', () => {
    it('should switch between active and completed tabs', () => {
      expect(component.currentTab).toBe('active');
      component.setTab('completed');
      expect(component.currentTab).toBe('completed');
      component.setTab('active');
      expect(component.currentTab).toBe('active');
    });
  });

  describe('Active Contracts Filtering & Search', () => {
    it('should filter active contracts by search term (title or client)', () => {
      component.searchQueryActive = 'Studio';
      component.applyFiltersActive();

      expect(component.activeContracts.length).toBe(1);
      expect(component.activeContracts[0]._id).toBe('c-2');
      expect(component.activeFiltersActive).toEqual([
        { label: 'Search: Studio', type: 'search', value: 'Studio' }
      ]);
    });

    it('should filter active contracts by category', () => {
      component.selectedCategoryActive = 'web-dev';
      component.applyFiltersActive();

      expect(component.activeContracts.length).toBe(1);
      expect(component.activeContracts[0]._id).toBe('c-1');
    });

    it('should reset active contracts filters', () => {
      component.searchQueryActive = 'Studio';
      component.selectedCategoryActive = 'design';
      component.applyFiltersActive();

      component.resetFiltersActive();

      expect(component.searchQueryActive).toBe('');
      expect(component.selectedCategoryActive).toBe('all');
      expect(component.activeContracts.length).toBe(2);
    });

    it('should remove specific active filters', () => {
      component.searchQueryActive = 'Angular';
      component.selectedCategoryActive = 'web-dev';
      component.applyFiltersActive();

      component.removeFilterActive({ label: 'Search: Angular', type: 'search', value: 'Angular' });
      expect(component.searchQueryActive).toBe('');

      component.removeFilterActive({ label: 'Category: Web Development', type: 'category', value: 'web-dev' });
      expect(component.selectedCategoryActive).toBe('all');
    });
  });

  describe('Completed Contracts Filtering & Search', () => {
    it('should filter completed contracts by search query', () => {
      component.searchQueryCompleted = 'Legacy';
      component.applyFiltersCompleted();

      expect(component.completedContracts.length).toBe(1);
      expect(component.completedContracts[0]._id).toBe('c-4');
      expect(component.activeFiltersCompleted).toEqual([
        { label: 'Search: Legacy', type: 'search', value: 'Legacy' }
      ]);
    });

    it('should filter completed contracts by category', () => {
      component.selectedCategoryCompleted = 'backend';
      component.applyFiltersCompleted();

      expect(component.completedContracts.length).toBe(2);
    });

    it('should reset completed contracts filters', () => {
      component.searchQueryCompleted = 'Legacy';
      component.applyFiltersCompleted();

      component.resetFiltersCompleted();

      expect(component.searchQueryCompleted).toBe('');
      expect(component.selectedCategoryCompleted).toBe('all');
      expect(component.completedContracts.length).toBe(2);
    });

    it('should remove specific completed filters', () => {
      component.searchQueryCompleted = 'Microservices';
      component.selectedCategoryCompleted = 'backend';
      component.applyFiltersCompleted();

      component.removeFilterCompleted({ label: 'Search: Microservices', type: 'search', value: 'Microservices' });
      expect(component.searchQueryCompleted).toBe('');

      component.removeFilterCompleted({ label: 'Category: Backend Development', type: 'category', value: 'backend' });
      expect(component.selectedCategoryCompleted).toBe('all');
    });
  });

  describe('Duration Calculator', () => {
    it('should return N/A if dates are missing', () => {
      expect(component.getDuration('', '')).toBe('N/A');
      expect(component.getDuration('2026-01-01', '')).toBe('N/A');
    });

    it('should calculate duration in days when less than 30 days', () => {
      const duration = component.getDuration('2026-02-01', '2026-02-15');
      expect(duration).toBe('14 Days');
    });

    it('should calculate duration in months when 30 days or more', () => {
      const duration = component.getDuration('2026-01-01', '2026-06-01');
      expect(duration).toContain('Months');
    });
  });

  describe('Actions & Navigation', () => {
    it('should return dropdown items for table row', () => {
      const items = component.getDropdownItems(mockContractsData[0]);
      expect(items.length).toBe(1);
      expect(items[0].value).toBe('view');
    });

    it('should navigate to contract details when view action is triggered', () => {
      component.onDropdownAction({ label: 'View Details', value: 'view' }, mockContractsData[0]);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/contract-details', 'c-1']);
    });

    it('should return feedback card action for completed/closed contract', () => {
      const completedActions = component.getFreelancerCardActions({ status: 'completed' });
      expect(completedActions[0].value).toBe('feedback');

      const closedActions = component.getFreelancerCardActions({ status: 'closed' });
      expect(closedActions[0].value).toBe('feedback');
    });

    it('should return diary card action for active contracts', () => {
      const actions = component.getFreelancerCardActions({ status: 'in progress' });
      expect(actions[0].value).toBe('diary');
    });

    it('should navigate to feedback reports on feedback card action', () => {
      component.onFreelancerCardAction({ action: 'feedback', contract: mockContractsData[2] });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/feedback-reports', 'c-3']);
    });

    it('should navigate to contract diary on diary card action', () => {
      component.onFreelancerCardAction({ action: 'diary', contract: mockContractsData[0] });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/contract-diary', 'c-1']);
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
