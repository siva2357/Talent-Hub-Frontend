import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ContractDiary } from './contract-diary';
import { ContractDiaryService } from '../../../core/services/contract-diary.service';
import { TokenService } from '../../../core/services/token.service';
import { ActivatedRoute, provideRouter, Router, convertToParamMap } from '@angular/router';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ContractDiary', () => {
  let component: ContractDiary;
  let fixture: ComponentFixture<ContractDiary>;

  let mockDiaryService: jasmine.SpyObj<ContractDiaryService>;
  let mockTokenService: jasmine.SpyObj<TokenService>;
  let mockRouter: jasmine.SpyObj<Router>;

  let paramMapSubject: BehaviorSubject<any>;
  let queryParamMapSubject: BehaviorSubject<any>;

  const mockDiaryData = {
    _id: 'diary-1',
    contractId: {
      _id: 'contract-123',
      contractTitle: 'Enterprise Angular Portal',
      estimatedBudget: 50000,
      spent: 20000,
      funded: 30000
    },
    phases: [
      {
        _id: 'phase-1',
        phaseNumber: 1,
        title: 'Architecture & UX Wireframes',
        description: 'Initial architectural foundation',
        budget: 15000,
        status: 'approved',
        dueDate: '2026-05-01'
      },
      {
        _id: 'phase-2',
        phaseNumber: 2,
        title: 'Core API Integration',
        description: 'Authentication and state management',
        budget: 20000,
        status: 'in-progress',
        dueDate: '2026-06-15'
      },
      {
        _id: 'phase-3',
        phaseNumber: 3,
        title: 'Testing & Deployment',
        description: 'E2E testing and production rollout',
        budget: 15000,
        status: 'submitted',
        dueDate: '2026-07-30'
      }
    ]
  };

  beforeEach(async () => {
    mockDiaryService = jasmine.createSpyObj('ContractDiaryService', ['getFreelancerDiary']);
    mockTokenService = jasmine.createSpyObj('TokenService', ['getRole']);

    mockTokenService.getRole.and.returnValue('freelancer');

    mockDiaryService.getFreelancerDiary.and.returnValue(of({
      success: true,
      diary: structuredClone(mockDiaryData),
      contract: { funded: 30000 }
    }));

    paramMapSubject = new BehaviorSubject(convertToParamMap({ id: 'contract-123' }));
    queryParamMapSubject = new BehaviorSubject(convertToParamMap({}));

    await TestBed.configureTestingModule({
      imports: [ContractDiary],
      providers: [
        provideRouter([]),
        { provide: ContractDiaryService, useValue: mockDiaryService },
        { provide: TokenService, useValue: mockTokenService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: paramMapSubject.asObservable(),
            queryParamMap: queryParamMapSubject.asObservable()
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spyOn(mockRouter, 'navigate');

    fixture = TestBed.createComponent(ContractDiary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization & Loading', () => {
    it('should extract contractId from route params, set userRole, and load diary', () => {
      expect(component.contractId).toBe('contract-123');
      expect(component.userRole).toBe('freelancer');
      expect(mockDiaryService.getFreelancerDiary).toHaveBeenCalledWith('contract-123');
      expect(component.diary).toBeDefined();
      expect(component.diary._id).toBe('diary-1');
      expect(component.diary.contractId.funded).toBe(30000);
      expect(component.isLoading).toBeFalse();
      expect(component.error).toBeNull();
    });

    it('should fallback to contractId from query params if param id is missing', () => {
      paramMapSubject.next(convertToParamMap({}));
      queryParamMapSubject.next(convertToParamMap({ contractId: 'contract-from-query' }));

      component.ngOnInit();

      expect(component.contractId).toBe('contract-from-query');
      expect(mockDiaryService.getFreelancerDiary).toHaveBeenCalledWith('contract-from-query');
    });

    it('should set error message if neither route param nor query param provides contract ID', () => {
      paramMapSubject.next(convertToParamMap({}));
      queryParamMapSubject.next(convertToParamMap({}));

      component.ngOnInit();

      expect(component.contractId).toBe('');
      expect(component.error).toBe('No contract ID provided in route.');
      expect(component.isLoading).toBeFalse();
    });

    it('should handle service returning success false with message', () => {
      mockDiaryService.getFreelancerDiary.and.returnValue(of({
        success: false,
        message: 'Contract not active'
      }));

      component.loadDiary();

      expect(component.error).toBe('Contract not active');
      expect(component.isLoading).toBeFalse();
    });

    it('should handle network/API error gracefully', () => {
      spyOn(console, 'error');
      mockDiaryService.getFreelancerDiary.and.returnValue(throwError(() => new Error('Server error')));

      component.loadDiary();

      expect(console.error).toHaveBeenCalled();
      expect(component.error).toBe('Failed to load contract diary. Please try again later.');
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('ngAfterViewInit & Columns', () => {
    it('should assign cell templates to table columns', fakeAsync(() => {
      component.ngAfterViewInit();
      tick();

      expect(component.columns.length).toBe(6);
      expect(component.columns[0].cellTemplate).toBe(component.noTemplate);
      expect(component.columns[1].cellTemplate).toBe(component.phaseDetailsTemplate);
      expect(component.columns[2].cellTemplate).toBe(component.statusTemplate);
      expect(component.columns[3].cellTemplate).toBe(component.budgetTemplate);
      expect(component.columns[4].cellTemplate).toBe(component.dueDateTemplate);
      expect(component.columns[5].cellTemplate).toBe(component.actionTemplate);
    }));
  });

  describe('Badge Variant Helper (getBadgeVariant)', () => {
    it('should return correct badge variants for phase statuses', () => {
      expect(component.getBadgeVariant('completed')).toBe('success');
      expect(component.getBadgeVariant('approved')).toBe('success');
      expect(component.getBadgeVariant('in-progress')).toBe('primary');
      expect(component.getBadgeVariant('active')).toBe('primary');
      expect(component.getBadgeVariant('changes-requested')).toBe('warning');
      expect(component.getBadgeVariant('revision-requested')).toBe('warning');
      expect(component.getBadgeVariant('submitted')).toBe('info');
      expect(component.getBadgeVariant('under-review')).toBe('info');
      expect(component.getBadgeVariant('unknown')).toBe('secondary');
      expect(component.getBadgeVariant('')).toBe('secondary');
    });
  });

  describe('Stats & Progress Getters', () => {
    it('should compute stat cards correctly', () => {
      const stats = component.stats;
      expect(stats.length).toBe(4);
      expect(stats[0].title).toBe('TOTAL BUDGET');
      expect(stats[0].value).toContain('50,000');
      expect(stats[1].title).toBe('EARNED SO FAR');
      expect(stats[1].value).toContain('20,000');
      expect(stats[2].title).toBe('REMAINING AMOUNT');
      expect(stats[2].value).toContain('30,000');
      expect(stats[3].title).toBe('TOTAL PHASES');
      expect(stats[3].value).toBe(3);
    });

    it('should return fallback zero stats when diary or contractId is null', () => {
      component.diary = null;
      const stats = component.stats;
      expect(stats[0].value).toBe('₹0');
      expect(stats[1].value).toBe('₹0');
      expect(stats[2].value).toBe('₹0');
      expect(stats[3].value).toBe(0);
    });

    it('should compute overall progress percentage based on approved phases', () => {
      // 1 approved out of 3 total phases -> 33%
      expect(component.getOverallProgress()).toBe(33);

      component.diary.phases[1].status = 'approved';
      // 2 approved out of 3 total phases -> 67%
      expect(component.getOverallProgress()).toBe(67);
    });

    it('should return 0 progress if phases array is empty or missing', () => {
      component.diary.phases = [];
      expect(component.getOverallProgress()).toBe(0);

      component.diary = null;
      expect(component.getOverallProgress()).toBe(0);
    });

    it('should determine if contract is funded', () => {
      expect(component.isFunded()).toBeTrue();

      component.diary.contractId.funded = 0;
      expect(component.isFunded()).toBeFalse();

      component.diary = null;
      expect(component.isFunded()).toBeFalse();
    });
  });

  describe('Actions & Navigation', () => {
    it('should return dropdown items for a phase', () => {
      const items = component.getDropdownItems(mockDiaryData.phases[0]);
      expect(items.length).toBe(1);
      expect(items[0].value).toBe('details');
      expect(items[0].label).toBe('Phase Details');
    });

    it('should navigate to phase details page with contractId query parameter', () => {
      const phase = mockDiaryData.phases[0];
      component.onDropdownAction({ label: 'Phase Details', value: 'details' }, phase);

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/contract-phase-details', 'phase-1'],
        { queryParams: { contractId: 'contract-123' } }
      );
    });

    it('should navigate to my contracts page via goToManageContracts', () => {
      component.goToManageContracts();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/my-contracts']);
    });
  });
});
