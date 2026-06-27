import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ContractProgressComponent } from './contract-progress.component';
import { ContractDiaryService } from '../../../../../core/services/contract-diary.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContractProgressComponent', () => {

  let component: ContractProgressComponent;
  let fixture: ComponentFixture<ContractProgressComponent>;

  let mockDiaryService: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockDiaryService = {
      getDiaryByContractId: jasmine.createSpy('getDiaryByContractId').and.returnValue(of({})),
      addPhase: jasmine.createSpy('addPhase').and.returnValue(of({ message: 'Success' })),
      reviewPhase: jasmine.createSpy('reviewPhase').and.returnValue(of({}))
    };

    mockAuthService = {
      currentUser: jasmine.createSpy('currentUser').and.returnValue({ role: 'client' })
    };

    await TestBed.configureTestingModule({
      imports: [ContractProgressComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: ContractDiaryService, useValue: mockDiaryService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: { queryParamMap: of({ get: () => '123' }) } }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ContractProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Status UI Helpers', () => {
    it('should return correct badge variants for overall statuses', () => {
      expect(component.getOverallStatusBadgeVariant('completed')).toBe('success');
      expect(component.getOverallStatusBadgeVariant('active')).toBe('primary');
      expect(component.getOverallStatusBadgeVariant('')).toBe('primary');
    });

    it('should return correct badge variants for phase statuses', () => {
      expect(component.getPhaseStatusBadgeVariant('approved')).toBe('success');
      expect(component.getPhaseStatusBadgeVariant('submitted')).toBe('warning');
      expect(component.getPhaseStatusBadgeVariant('changes-requested')).toBe('danger');
      expect(component.getPhaseStatusBadgeVariant('in-progress')).toBe('primary');
      expect(component.getPhaseStatusBadgeVariant('unknown-status')).toBe('secondary');
    });
  });

  describe('Phase Modal Management', () => {
    it('should open add phase modal and set selected diary id', () => {
      component.openAddPhaseModal('diary-123');
      expect(component.selectedDiaryId()).toBe('diary-123');
      expect(component.showAddPhaseModal()).toBeTrue();
      expect(document.body.classList.contains('modal-open')).toBeTrue();
    });

    it('should close add phase modal and reset form', () => {
      component.openAddPhaseModal('diary-123');

      component.phaseForm.patchValue({ name: 'Test' });
      component.closeAddPhaseModal();

      expect(component.showAddPhaseModal()).toBeFalse();
      expect(component.selectedDiaryId()).toBeNull();
      expect(component.tempUploadUrl()).toBeNull();
      expect(component.phaseForm.value.name).toBeNull();
      expect(component.phaseForm.value.clientAttachments).toEqual([]);
      expect(document.body.classList.contains('modal-open')).toBeFalse();
    });
  });

  describe('Phase Creation', () => {
    it('should not call addPhase service if form is invalid', () => {
      component.phaseForm.patchValue({ name: '' });
      component.addPhase('diary-123');
      expect(mockDiaryService.addPhase).not.toHaveBeenCalled();
    });

    it('should call addPhase service and reset on success', () => {
      spyOn(window, 'alert');
      spyOn(component, 'fetchContractDiary');
      spyOn(component, 'closeAddPhaseModal');

      component.phaseForm.patchValue({
        name: 'Phase 1',
        description: 'Desc',
        deadline: '2025-01-01',
        amount: 100,
        clientAttachments: []
      });

      component.addPhase('diary-123');

      expect(mockDiaryService.addPhase).toHaveBeenCalledWith('diary-123', jasmine.objectContaining({
        name: 'Phase 1',
        amount: 100
      }));
      expect(window.alert).toHaveBeenCalledWith('Success');
      expect(component.closeAddPhaseModal).toHaveBeenCalled();
      expect(component.fetchContractDiary).toHaveBeenCalled();
      expect(component.addingPhase['diary-123']).toBeFalse();
    });

    it('should handle addPhase error', () => {
      spyOn(window, 'alert');
      mockDiaryService.addPhase.and.returnValue(throwError(() => ({ error: { message: 'Error adding phase' } })));

      component.phaseForm.patchValue({
        name: 'Phase 1',
        description: 'Desc',
        deadline: '2025-01-01',
        amount: 100
      });

      component.addPhase('diary-123');

      expect(window.alert).toHaveBeenCalledWith('Error adding phase');
      expect(component.addingPhase['diary-123']).toBeFalse();
    });
  });

  describe('Phase Review', () => {
    it('should approve phase and fetch diary', () => {
      spyOn(component, 'fetchContractDiary');
      component.approvePhase('diary-123', 'phase-1');
      expect(mockDiaryService.reviewPhase).toHaveBeenCalledWith('diary-123', 'phase-1', 'approve');
      expect(component.fetchContractDiary).toHaveBeenCalledWith('phase-1');
    });

    it('should request changes and fetch diary', () => {
      spyOn(component, 'fetchContractDiary');
      component.feedbackText['phase-1'] = 'Needs more work';
      component.requestChanges('diary-123', 'phase-1');

      expect(mockDiaryService.reviewPhase).toHaveBeenCalledWith('diary-123', 'phase-1', 'request-changes', 'Needs more work');
      expect(component.feedbackText['phase-1']).toBe('');
      expect(component.fetchContractDiary).toHaveBeenCalledWith('phase-1');
    });
  });

  describe('Attachments Management', () => {
    it('should add uploaded file to form', () => {
      component.phaseForm.patchValue({ clientAttachments: [] });
      const fileInfo = { url: 'http://test.com/img.png', fileName: 'img.png', fileSize: '1MB', fileType: 'image/png' };

      component.onFileUploaded(fileInfo);

      expect(component.phaseForm.value.clientAttachments?.length).toBe(1);
      expect(component.phaseForm.value.clientAttachments?.[0].fileName).toBe('img.png');
      expect(component.tempUploadUrl()).toBeNull();
    });

    it('should remove attachment by index', () => {
      const mockAttachment = { fileUrl: 'test', fileName: 'test', fileType: 'test', fileSize: 'test' };
      component.phaseForm.patchValue({ clientAttachments: [mockAttachment] });

      component.removeAttachment(0);

      expect(component.phaseForm.value.clientAttachments?.length).toBe(0);
    });
  });

});
