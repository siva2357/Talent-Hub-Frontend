import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhaseDetails } from './phase-details';
import { ContractDiaryService } from '../../../core/services/contract-diary.service';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PhaseDetails', () => {
  let component: PhaseDetails;
  let fixture: ComponentFixture<PhaseDetails>;

  let mockDiaryService: jasmine.SpyObj<ContractDiaryService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockDiaryService = jasmine.createSpyObj('ContractDiaryService', ['getDiaryByContractId', 'reviewPhase']);
    
    mockActivatedRoute = {
      paramMap: of(new Map([['id', 'phase-123']])),
      queryParamMap: of(new Map([['contractId', 'contract-123']]))
    };

    mockDiaryService.getDiaryByContractId.and.returnValue(of({
      success: true,
      diary: {
        _id: 'diary-123',
        phases: [
          { 
            _id: 'phase-123', 
            name: 'Design Phase', 
            status: 'submitted', 
            amount: 500,
            deadline: '2026-12-01T00:00:00.000Z',
            revisions: [{ note: 'First revision' }]
          }
        ]
      }
    }));

    await TestBed.configureTestingModule({
      imports: [PhaseDetails],
      providers: [
        provideRouter([]),
        { provide: ContractDiaryService, useValue: mockDiaryService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PhaseDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load phase details on init', () => {
    expect(mockDiaryService.getDiaryByContractId).toHaveBeenCalledWith('contract-123');
    expect(component.phase).toBeTruthy();
    expect(component.phase._id).toBe('phase-123');
    expect(component.isLoading).toBeFalse();
  });

  it('should calculate stats correctly', () => {
    const stats = component.phaseStats;
    expect(stats.length).toBe(4);
    expect(stats[0].value).toBe('₹500'); // Budget
    expect(stats[1].value).toBe('₹0'); // Released (status is submitted, not approved)
    expect(stats[2].value).toBe('₹500'); // Remaining
    expect(stats[3].value).toContain('Dec 1, 2026'); // Due date
  });

  it('should calculate phase progress correctly based on status', () => {
    expect(component.phaseProgress).toBe(70); // 'submitted' is 70
    
    component.phase.status = 'approved';
    expect(component.phaseProgress).toBe(100);

    component.phase.status = 'in-progress';
    expect(component.phaseProgress).toBe(40);
  });

  it('should retrieve latest revision', () => {
    const rev = component.latestRevision;
    expect(rev).toBeTruthy();
    expect(rev.note).toBe('First revision');
  });

  it('should call reviewPhase on submit review', () => {
    mockDiaryService.reviewPhase.and.returnValue(of({
      success: true,
      phase: { _id: 'phase-123', status: 'approved' }
    }));
    
    component.clientFeedback = 'Great job';
    component.onReviewPhase('approve');
    
    expect(component.isReviewing).toBeFalse();
    expect(mockDiaryService.reviewPhase).toHaveBeenCalledWith('diary-123', 'phase-123', {
      action: 'approve',
      clientFeedback: 'Great job'
    });
    expect(component.phase.status).toBe('approved');
    expect(component.clientFeedback).toBe('');
  });

  it('should handle error when loading phase details', () => {
    mockDiaryService.getDiaryByContractId.and.returnValue(throwError(() => new Error('API Error')));
    component.loadPhaseDetails();
    expect(component.error).toBe('Failed to load details.');
    expect(component.isLoading).toBeFalse();
  });
});
