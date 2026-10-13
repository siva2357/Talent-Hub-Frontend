import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ContractPhaseDetails } from './contract-phase-details';
import { ContractDiaryService } from '../../../core/services/contract-diary.service';
import { ActivatedRoute, provideRouter, convertToParamMap } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ContractPhaseDetails', () => {
  let component: ContractPhaseDetails;
  let fixture: ComponentFixture<ContractPhaseDetails>;

  let mockDiaryService: jasmine.SpyObj<ContractDiaryService>;

  let paramMapSubject: BehaviorSubject<any>;
  let queryParamMapSubject: BehaviorSubject<any>;

  const mockPhaseData = {
    _id: 'phase-101',
    phaseNumber: 1,
    title: 'Frontend Architecture & Prototyping',
    description: 'Set up Angular project structure and routing',
    amount: 12000,
    status: 'in-progress',
    deadline: '2026-05-15T00:00:00.000Z',
    revisions: [
      { revisionNumber: 1, note: 'Initial submission revision' },
      { revisionNumber: 2, note: 'Adjusted button styles' }
    ]
  };

  const mockDiaryData = {
    _id: 'diary-202',
    contractId: 'contract-303',
    phases: [mockPhaseData]
  };

  beforeEach(async () => {
    mockDiaryService = jasmine.createSpyObj('ContractDiaryService', [
      'getFreelancerDiary',
      'submitPhase'
    ]);

    mockDiaryService.getFreelancerDiary.and.returnValue(of({
      success: true,
      diary: structuredClone(mockDiaryData)
    }));

    paramMapSubject = new BehaviorSubject(convertToParamMap({ id: 'phase-101' }));
    queryParamMapSubject = new BehaviorSubject(convertToParamMap({ contractId: 'contract-303' }));

    await TestBed.configureTestingModule({
      imports: [ContractPhaseDetails],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ContractDiaryService, useValue: mockDiaryService },
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

    fixture = TestBed.createComponent(ContractPhaseDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit & Phase Details Loading', () => {
    it('should extract phaseId and contractId from route and load phase details', () => {
      expect(component.phaseId).toBe('phase-101');
      expect(component.contractId).toBe('contract-303');
      expect(mockDiaryService.getFreelancerDiary).toHaveBeenCalledWith('contract-303');
      expect(component.diaryId).toBe('diary-202');
      expect(component.phase).toBeDefined();
      expect(component.phase._id).toBe('phase-101');
      expect(component.isLoading).toBeFalse();
      expect(component.error).toBeNull();
    });

    it('should set error if the specific phase is not found within diary phases', () => {
      paramMapSubject.next(convertToParamMap({ id: 'non-existent-phase' }));
      component.loadPhaseDetails();

      expect(component.phase).toBeUndefined();
      expect(component.error).toBe('Phase not found.');
      expect(component.isLoading).toBeFalse();
    });

    it('should set error when getFreelancerDiary returns success false', () => {
      mockDiaryService.getFreelancerDiary.and.returnValue(of({
        success: false,
        message: 'Unauthorized access'
      }));

      component.loadPhaseDetails();

      expect(component.error).toBe('Unauthorized access');
      expect(component.isLoading).toBeFalse();
    });

    it('should handle API network failure gracefully', () => {
      spyOn(console, 'error');
      mockDiaryService.getFreelancerDiary.and.returnValue(throwError(() => new Error('Server down')));

      component.loadPhaseDetails();

      expect(console.error).toHaveBeenCalled();
      expect(component.error).toBe('Failed to load details.');
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('Getters & Computations', () => {
    it('should return latest revision', () => {
      expect(component.latestRevision).toEqual({ revisionNumber: 2, note: 'Adjusted button styles' });
    });

    it('should return null for latestRevision if revisions are missing or empty', () => {
      component.phase.revisions = [];
      expect(component.latestRevision).toBeNull();

      component.phase = null;
      expect(component.latestRevision).toBeNull();
    });

    it('should compute amount released and remaining amount correctly for approved phase', () => {
      component.phase.status = 'approved';
      expect(component.amountReleased).toBe(12000);
      expect(component.remainingAmount).toBe(0);
    });

    it('should compute amount released as 0 and remaining amount as full amount for pending phase', () => {
      component.phase.status = 'in-progress';
      expect(component.amountReleased).toBe(0);
      expect(component.remainingAmount).toBe(12000);
    });

    it('should format phaseStats accurately', () => {
      const stats = component.phaseStats;
      expect(stats.length).toBe(4);
      expect(stats[0].title).toBe('PHASE BUDGET');
      expect(stats[0].value).toContain('12,000');
      expect(stats[1].title).toBe('AMOUNT RELEASED');
      expect(stats[2].title).toBe('REMAINING AMOUNT');
      expect(stats[3].title).toBe('DUE DATE');
      expect(stats[3].value).toBe('May 15, 2026');
    });

    it('should display "No Due Date" when phase deadline is missing', () => {
      component.phase.deadline = undefined;
      const stats = component.phaseStats;
      expect(stats[3].value).toBe('No Due Date');
    });
  });

  describe('Attachments & File Management', () => {
    it('should add uploaded file to submissionAttachments', () => {
      component.onFileUpload('https://s3.amazonaws.com/bucket/spec-v1.pdf');
      expect(component.submissionAttachments.length).toBe(1);
      expect(component.submissionAttachments[0]).toEqual({
        fileUrl: 'https://s3.amazonaws.com/bucket/spec-v1.pdf',
        fileName: 'spec-v1.pdf'
      });
    });

    it('should remove attachment by index', () => {
      component.submissionAttachments = [
        { fileUrl: 'https://example.com/file1.png', fileName: 'file1.png' },
        { fileUrl: 'https://example.com/file2.png', fileName: 'file2.png' }
      ];

      component.removeAttachment(0);
      expect(component.submissionAttachments.length).toBe(1);
      expect(component.submissionAttachments[0].fileName).toBe('file2.png');
    });

    it('should extract correct file name from diverse file objects', () => {
      expect(component.getFileName({ fileName: 'doc.pdf' })).toBe('doc.pdf');
      expect(component.getFileName({ name: 'image.png' })).toBe('image.png');
      expect(component.getFileName({ fileUrl: 'https://cdn.com/asset.zip' })).toBe('asset.zip');
      expect(component.getFileName({})).toBe('attachment');
    });

    it('should trigger anchor download when downloadFile is called with valid url', () => {
      const appendSpy = spyOn(document.body, 'appendChild').and.callThrough();
      const removeSpy = spyOn(document.body, 'removeChild').and.callThrough();

      component.downloadFile({ fileUrl: 'https://cdn.com/deliverable.zip', fileName: 'deliverable.zip' });

      expect(appendSpy).toHaveBeenCalled();
      expect(removeSpy).toHaveBeenCalled();
    });

    it('should do nothing in downloadFile when url is not present', () => {
      const appendSpy = spyOn(document.body, 'appendChild');
      component.downloadFile({});
      expect(appendSpy).not.toHaveBeenCalled();
    });
  });

  describe('Submit Phase Work Flow', () => {
    it('should submit phase work successfully and clear input form', fakeAsync(() => {
      component.freelancerNote = 'Completed all tasks successfully.';
      component.submissionAttachments = [{ fileUrl: 'https://cdn.com/build.zip', fileName: 'build.zip' }];

      const updatedPhase = { ...mockPhaseData, status: 'submitted' };
      mockDiaryService.submitPhase.and.returnValue(of({
        success: true,
        phase: updatedPhase
      }));

      component.submitPhaseWork();

      expect(component.isSubmitting).toBeTrue();
      expect(mockDiaryService.submitPhase).toHaveBeenCalledWith('diary-202', 'phase-101', {
        freelancerNote: 'Completed all tasks successfully.',
        attachments: [{ fileUrl: 'https://cdn.com/build.zip', fileName: 'build.zip' }]
      });

      tick(500);

      expect(component.isSubmitting).toBeFalse();
      expect(component.phase.status).toBe('submitted');
      expect(component.freelancerNote).toBe('');
      expect(component.submissionAttachments).toEqual([]);
    }));

    it('should handle error when submitting phase work fails', fakeAsync(() => {
      spyOn(console, 'error');
      mockDiaryService.submitPhase.and.returnValue(throwError(() => new Error('Submit failed')));

      component.submitPhaseWork();
      expect(component.isSubmitting).toBeTrue();

      tick(500);

      expect(console.error).toHaveBeenCalled();
      expect(component.isSubmitting).toBeFalse();
    }));

    it('should return early if diaryId or phase is missing when submitting', () => {
      component.diaryId = '';
      component.submitPhaseWork();
      expect(mockDiaryService.submitPhase).not.toHaveBeenCalled();

      component.diaryId = 'diary-202';
      component.phase = null;
      component.submitPhaseWork();
      expect(mockDiaryService.submitPhase).not.toHaveBeenCalled();
    });
  });
});
