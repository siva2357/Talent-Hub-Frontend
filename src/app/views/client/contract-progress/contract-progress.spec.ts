import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContractProgress } from './contract-progress';
import { ContractDiaryService } from '../../../core/services/contract-diary.service';
import { TokenService } from '../../../core/services/token.service';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ContractProgress', () => {
  let component: ContractProgress;
  let fixture: ComponentFixture<ContractProgress>;

  let mockDiaryService: jasmine.SpyObj<ContractDiaryService>;
  let mockTokenService: jasmine.SpyObj<TokenService>;
  let router: Router;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockDiaryService = jasmine.createSpyObj('ContractDiaryService', ['getDiaryByContractId', 'submitPhase', 'reviewPhase']);
    mockTokenService = jasmine.createSpyObj('TokenService', ['getRole']);

    mockTokenService.getRole.and.returnValue('client');
    mockActivatedRoute = {
      paramMap: of(new Map([['id', 'contract-123']]))
    };

    mockDiaryService.getDiaryByContractId.and.returnValue(of({
      success: true,
      diary: {
        _id: 'diary-1',
        contractId: {
          estimatedBudget: 1000,
          spent: 200,
          funded: 1000
        },
        phases: [
          { _id: 'phase-1', status: 'approved' },
          { _id: 'phase-2', status: 'pending' }
        ]
      },
      contract: { funded: 1000 }
    }));

    await TestBed.configureTestingModule({
      imports: [ContractProgress],
      providers: [
        provideRouter([]),
        { provide: ContractDiaryService, useValue: mockDiaryService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ContractProgress);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load diary on init if contractId is present', () => {
    expect(mockDiaryService.getDiaryByContractId).toHaveBeenCalledWith('contract-123');
    expect(component.diary).toBeTruthy();
    expect(component.isLoading).toBeFalse();
  });

  it('should calculate stats correctly', () => {
    const stats = component.stats;
    expect(stats.length).toBe(4);
    expect(stats[0].value).toBe('₹1,000'); // Budget
    expect(stats[1].value).toBe('₹200'); // Spent
    expect(stats[2].value).toBe('₹800'); // Remaining
    expect(stats[3].value).toBe(2); // Total phases
  });

  it('should calculate overall progress correctly', () => {
    // 1 approved out of 2 total = 50%
    expect(component.getOverallProgress()).toBe(50);
  });

  it('should return correct dropdown items for client', () => {
    const items = component.getDropdownItems({ status: 'pending' });
    expect(items.length).toBe(2);
    expect(items[1].value).toBe('edit');
  });

  it('should navigate to phase details on dropdown action', () => {
    component.onDropdownAction({ label: 'Details', value: 'details', icon: '' }, { _id: 'phase-1' });
    expect(router.navigate).toHaveBeenCalledWith(['/phase-details', 'phase-1'], { queryParams: { contractId: 'contract-123' } });
  });
  
  it('should check if contract is funded', () => {
    expect(component.isFunded()).toBeTrue();
  });
});
