import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ContractDiaryComponent } from './contract-diary.component';
import { ContractDiaryService } from '../../../../../core/services/contract-diary.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContractDiaryComponent', () => {
  let component: ContractDiaryComponent;
  let fixture: ComponentFixture<ContractDiaryComponent>;
  let mockDiaryService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockDiaryService = {
      getFreelancerDiaries: jasmine.createSpy('getFreelancerDiaries').and.returnValue(of({
        success: true,
        diary: {
          _id: 'd1',
          contractId: {
            contractTitle: 'Test Contract',
            contractStartDate: new Date(Date.now() - 10000).toISOString(),
            estimatedBudget: 500
          },
          clientId: { registrationDetails: { fullName: 'Client Name' } },
          phases: [
            {
              _id: 'p1',
              name: 'Phase 1',
              status: 'pending',
              amount: 500,
              revisions: [],
              clientAttachments: []
            },
            {
              _id: 'p2',
              name: 'Phase 2',
              status: 'in-progress',
              amount: 200,
              revisions: [],
              clientAttachments: []
            }
          ]
        }
      })),
      startPhase: jasmine.createSpy('startPhase').and.returnValue(of({ success: true })),
      submitPhaseUpdate: jasmine.createSpy('submitPhaseUpdate').and.returnValue(of({ success: true }))
    };

    mockActivatedRoute = {
      snapshot: { queryParamMap: { get: () => 'c1' } }
    };

    await TestBed.configureTestingModule({
      imports: [ContractDiaryComponent, HttpClientTestingModule],
      providers: [
        { provide: ContractDiaryService, useValue: mockDiaryService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContractDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load diary via toSignal', fakeAsync(() => {
    tick(); // resolve observables
    expect(component).toBeTruthy();
    expect(mockDiaryService.getFreelancerDiaries).toHaveBeenCalledWith('c1');
    const diary = component.diary();
    expect(diary).toBeTruthy();
    expect(diary?.phases.length).toBe(2);
    expect(component.isLoading()).toBeFalse();
  }));

  it('should properly track openSubmitModal signal updates', fakeAsync(() => {
    tick();
    const phase = component.diary()?.phases[1]!;
    
    component.openSubmitModal('d1', phase);
    expect(component.selectedDiaryId()).toBe('d1');
    expect(component.selectedPhase()).toEqual(phase);
    expect(component.showSubmitModal()).toBeTrue();
    expect(component.uploadedFiles()[phase._id]).toEqual([]); // Init to empty array if missing

    component.closeSubmitModal();
    expect(component.showSubmitModal()).toBeFalse();
    expect(component.selectedPhase()).toBeNull();
  }));

  it('should immutably update uploaded files state', fakeAsync(() => {
    tick();
    const phaseId = 'p1';
    
    component.onFileUploaded(phaseId, {
      url: 'url', fileName: 'test.png', fileType: 'image/png', fileSize: '1mb'
    });

    const files = component.uploadedFiles()[phaseId];
    expect(files.length).toBe(1);
    expect(files[0].fileName).toBe('test.png');
    
    component.removeAttachment(phaseId, 0);
    expect(component.uploadedFiles()[phaseId].length).toBe(0);
  }));

  it('should trigger startPhase and handle submitting state', fakeAsync(() => {
    tick();
    
    // Start the phase
    component.startPhase('d1', 'p1');
    
    tick(); // allow inner subscribe to complete
    
    expect(mockDiaryService.startPhase).toHaveBeenCalledWith('d1', 'p1');
    expect(component.submitting()['p1']).toBeFalse();
  }));
  
  it('should trigger submitUpdate properly', fakeAsync(() => {
    tick();
    
    component.openSubmitModal('d1', component.diary()?.phases[1]!);
    component.submitPhaseForm.controls['freelancerNote'].setValue('Task done');
    
    component.submitUpdate('d1', 'p2');
    
    tick();
    
    expect(mockDiaryService.submitPhaseUpdate).toHaveBeenCalled();
    expect(component.showSubmitModal()).toBeFalse();
    expect(component.submitting()['p2']).toBeFalse();
  }));
});
