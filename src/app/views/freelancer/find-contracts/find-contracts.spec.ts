import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FindContracts } from './find-contracts';
import { ContractService } from '../../../core/services/contract.service';
import { ProfileService } from '../../../core/services/profile.service';
import { MasterDataService } from '../../../core/services/master-data.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FindContracts', () => {
  let component: FindContracts;
  let fixture: ComponentFixture<FindContracts>;

  let mockContractService: jasmine.SpyObj<ContractService>;
  let mockProfileService: jasmine.SpyObj<ProfileService>;
  let mockMasterDataService: jasmine.SpyObj<MasterDataService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockContracts = [
    {
      _id: '1',
      contractTitle: 'Frontend Angular Developer',
      contractDescription: 'Build modern Angular web applications with clean code',
      contractCategory: 'web-dev',
      contractSubject: 'Angular',
      estimatedBudget: 1500,
      industry: 'Technology',
      status: 'open',
      hasApplied: false
    },
    {
      _id: '2',
      contractTitle: 'UI/UX Designer Needed',
      contractDescription: 'Figma prototypes and mobile designs',
      contractCategory: 'design',
      contractSubject: 'UI/UX',
      estimatedBudget: 800,
      industry: 'Design',
      status: 'open',
      hasApplied: true
    }
  ];

  const mockSavedContracts = [
    {
      _id: '1',
      contractTitle: 'Frontend Angular Developer',
      contractDescription: 'Build modern Angular web applications with clean code',
      contractCategory: 'web-dev',
      contractSubject: 'Angular',
      estimatedBudget: 1500,
      industry: 'Technology',
      status: 'open',
      hasApplied: false
    }
  ];

  beforeEach(async () => {
    mockContractService = jasmine.createSpyObj('ContractService', [
      'getAllContracts',
      'getSavedContracts',
      'saveContract',
      'unsaveContract'
    ]);
    mockProfileService = jasmine.createSpyObj('ProfileService', ['getProfile']);
    mockMasterDataService = jasmine.createSpyObj('MasterDataService', ['getMasterDataByCategory']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Default mock responses
    mockMasterDataService.getMasterDataByCategory.and.returnValue(of({
      success: true,
      data: [
        { key: 'web-dev', value: 'Web Development' },
        { key: 'design', value: 'Design & Creative' }
      ]
    }));

    mockContractService.getAllContracts.and.returnValue(of({
      success: true,
      contracts: [...mockContracts] as any[]
    }));

    mockContractService.getSavedContracts.and.returnValue(of({
      success: true,
      contracts: [...mockSavedContracts] as any[]
    }));

    await TestBed.configureTestingModule({
      imports: [FindContracts],
      providers: [
        { provide: ContractService, useValue: mockContractService },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: MasterDataService, useValue: mockMasterDataService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FindContracts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit & Initialization', () => {
    it('should fetch master data categories on init', () => {
      expect(mockMasterDataService.getMasterDataByCategory).toHaveBeenCalledWith('ContractCategories');
      expect(component.categoryOptions.length).toBe(3); // 'All Categories' + 2 fetched
      expect(component.categoryOptions[1]).toEqual({ label: 'Web Development', value: 'web-dev' });
    });

    it('should fetch contracts and saved contracts on init', () => {
      expect(mockContractService.getAllContracts).toHaveBeenCalled();
      expect(mockContractService.getSavedContracts).toHaveBeenCalled();
      expect(component.contracts.length).toBe(2);
      expect(component.isLoading).toBeFalse();
    });

    it('should handle master data fetch error gracefully', () => {
      spyOn(console, 'error');
      mockMasterDataService.getMasterDataByCategory.and.returnValue(throwError(() => new Error('Error')));
      component.fetchMasterData();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle getAllContracts error gracefully', () => {
      spyOn(console, 'error');
      mockContractService.getAllContracts.and.returnValue(throwError(() => new Error('Error')));
      component.fetchContracts();
      expect(component.isLoading).toBeFalse();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Tab switching', () => {
    it('should switch to saved tab and fetch saved contracts', () => {
      component.setTab('saved');
      expect(component.activeTab).toBe('saved');
      expect(component.savedContracts.length).toBe(1);
      expect(mockContractService.getSavedContracts).toHaveBeenCalled();
    });

    it('should switch back to discover tab and fetch contracts', () => {
      component.setTab('saved');
      component.setTab('discover');
      expect(component.activeTab).toBe('discover');
      expect(mockContractService.getAllContracts).toHaveBeenCalled();
    });

    it('should not do anything if clicking the already active tab', () => {
      mockContractService.getAllContracts.calls.reset();
      component.setTab('discover');
      expect(mockContractService.getAllContracts).not.toHaveBeenCalled();
    });
  });

  describe('Filtering functionality', () => {
    it('should filter contracts by search query in title or description', () => {
      component.searchQuery = 'Angular';
      component.applyFilters();
      expect(component.contracts.length).toBe(1);
      expect(component.contracts[0].contractTitle).toBe('Frontend Angular Developer');
      expect(component.activeFilters.some(f => f.type === 'search')).toBeTrue();
    });

    it('should filter contracts by category', () => {
      component.searchCategory = 'design';
      component.applyFilters();
      expect(component.contracts.length).toBe(1);
      expect(component.contracts[0].contractTitle).toBe('UI/UX Designer Needed');
    });

    it('should filter contracts by minimum budget', () => {
      component.searchBudget = '1000';
      component.applyFilters();
      expect(component.contracts.length).toBe(1);
      expect(component.contracts[0].estimatedBudget).toBe(1500);
    });

    it('should reset filters properly', () => {
      component.searchQuery = 'Angular';
      component.searchCategory = 'web-dev';
      component.searchBudget = '1000';
      component.applyFilters();

      component.resetFilters();
      expect(component.searchQuery).toBe('');
      expect(component.searchCategory).toBe('all');
      expect(component.searchBudget).toBe('');
      expect(component.contracts.length).toBe(2);
      expect(component.activeFilters.length).toBe(0);
    });

    it('should remove a specific search filter', () => {
      component.searchQuery = 'Angular';
      component.applyFilters();
      expect(component.activeFilters.length).toBe(1);

      component.removeFilter({ label: 'Search: Angular', type: 'search', value: 'Angular' });
      expect(component.searchQuery).toBe('');
      expect(component.contracts.length).toBe(2);
    });

    it('should remove a specific category filter', () => {
      component.searchCategory = 'design';
      component.applyFilters();

      component.removeFilter({ label: 'Category: Design & Creative', type: 'category', value: 'design' });
      expect(component.searchCategory).toBe('all');
      expect(component.contracts.length).toBe(2);
    });

    it('should remove a specific budget filter', () => {
      component.searchBudget = '1000';
      component.applyFilters();

      component.removeFilter({ label: 'Budget: 1000', type: 'budget', value: '1000' });
      expect(component.searchBudget).toBe('');
      expect(component.contracts.length).toBe(2);
    });
  });

  describe('Contract Save and Unsave Actions', () => {
    it('should identify if a contract is saved', () => {
      expect(component.isContractSaved('1')).toBeTrue();
      expect(component.isContractSaved('2')).toBeFalse();
    });

    it('should save an unsaved contract and refresh saved contracts', () => {
      mockContractService.saveContract.and.returnValue(of({ success: true, message: 'Contract saved' }));
      const unsavedCard = { ...mockContracts[1], hasSaved: false } as any;

      component.toggleSave(unsavedCard);

      expect(unsavedCard.hasSaved).toBeTrue();
      expect(mockContractService.saveContract).toHaveBeenCalledWith('2');
    });

    it('should unsave an already saved contract', () => {
      mockContractService.unsaveContract.and.returnValue(of({ success: true, message: 'Contract unsaved' }));
      const savedCard = { ...mockContracts[0], hasSaved: true } as any;

      component.toggleSave(savedCard);

      expect(savedCard.hasSaved).toBeFalse();
      expect(mockContractService.unsaveContract).toHaveBeenCalledWith('1');
    });

    it('should remove contract from savedContracts array when unsaving while on saved tab', () => {
      component.activeTab = 'saved';
      mockContractService.unsaveContract.and.returnValue(of({ success: true, message: 'Contract unsaved' }));
      mockContractService.getSavedContracts.and.returnValue(of({ success: true, contracts: [] }));
      const savedCard = { ...mockSavedContracts[0], hasSaved: true } as any;

      component.toggleSave(savedCard);

      expect(component.savedContracts.find(c => c._id === '1')).toBeUndefined();
    });
  });

  describe('Navigation & Detail view', () => {
    it('should navigate to contract details page with contract ID', () => {
      const card = mockContracts[0] as any;
      component.viewDetails(card);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/contract-details', '1']);
    });
  });

  describe('Lifecycle cleanup', () => {
    it('should unsubscribe on destroy', () => {
      spyOn((component as any).filterSubscription, 'unsubscribe');
      component.ngOnDestroy();
      expect((component as any).filterSubscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
