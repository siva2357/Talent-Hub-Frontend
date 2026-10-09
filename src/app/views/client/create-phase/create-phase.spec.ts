import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePhase } from './create-phase';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, provideRouter } from '@angular/router';
import { ContractDiaryService } from '../../../core/services/contract-diary.service';
import { FileService } from '../../../core/services/file.service';
import { ToastService } from '../../../core/services/ui/toast.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CreatePhase', () => {
  let component: CreatePhase;
  let fixture: ComponentFixture<CreatePhase>;

  let mockDiaryService: jasmine.SpyObj<ContractDiaryService>;
  let mockFileService: jasmine.SpyObj<FileService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let router: Router;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockDiaryService = jasmine.createSpyObj('ContractDiaryService', [
      'getDiaryByContractId',
      'addPhase',
      'updatePhase'
    ]);
    mockFileService = jasmine.createSpyObj('FileService', ['uploadFile']);
    mockToastService = jasmine.createSpyObj('ToastService', ['show']);

    mockActivatedRoute = {
      paramMap: of({ get: () => 'contract123' }),
      queryParamMap: of({ get: () => 'phase123' })
    };

    mockDiaryService.getDiaryByContractId.and.returnValue(of({
      success: true,
      diary: {
        _id: 'diary123',
        contractId: 'contract123',
        phases: [
          {
            _id: 'phase123',
            name: 'Phase 1',
            amount: 500,
            deadline: '2026-12-01T00:00:00.000Z',
            clientAttachments: []
          }
        ]
      }
    }));

    mockDiaryService.addPhase.and.returnValue(of({ success: true }));
    mockDiaryService.updatePhase.and.returnValue(of({ success: true }));

    await TestBed.configureTestingModule({
      imports: [CreatePhase, ReactiveFormsModule],
      providers: [
        FormBuilder,
        provideRouter([]),
        { provide: ContractDiaryService, useValue: mockDiaryService },
        { provide: FileService, useValue: mockFileService },
        { provide: ToastService, useValue: mockToastService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePhase);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize edit mode if phaseId is provided', () => {
    expect(component.isEditMode).toBeTrue();
    expect(component.phaseId).toBe('phase123');
    expect(component.contractId).toBe('contract123');
    expect(mockDiaryService.getDiaryByContractId).toHaveBeenCalledWith('contract123');
    expect(component.phaseForm.get('phaseName')?.value).toBe('Phase 1');
  });

  it('should add and remove deliverables', () => {
    const initialLength = component.deliverables.length;
    component.addDeliverable();
    expect(component.deliverables.length).toBe(initialLength + 1);
    component.removeDeliverable(0);
    expect(component.deliverables.length).toBe(initialLength);
  });

  it('should not submit if form is invalid', () => {
    component.phaseForm.get('phaseName')?.setValue('');
    component.createPhase();
    
    expect(mockToastService.show).toHaveBeenCalled();
    expect(mockDiaryService.addPhase).not.toHaveBeenCalled();
    expect(mockDiaryService.updatePhase).not.toHaveBeenCalled();
  });

  it('should call updatePhase when in edit mode', () => {
    component.phaseForm.patchValue({
      phaseName: 'Updated Phase',
      deadline: '2026-12-31',
      budget: 1000
    });
    // Set at least one deliverable and criteria to be valid
    component.deliverables.at(0).setValue('Deliverable 1');
    component.acceptanceCriteria.at(0).setValue('Criteria 1');
    
    component.createPhase();
    
    expect(mockDiaryService.updatePhase).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/contract-progress', 'contract123']);
  });

  it('should call addPhase when not in edit mode', () => {
    component.isEditMode = false;
    component.phaseId = null;
    
    component.phaseForm.patchValue({
      phaseName: 'New Phase',
      deadline: '2026-12-31',
      budget: 1000
    });
    component.deliverables.at(0).setValue('Deliverable 1');
    component.acceptanceCriteria.at(0).setValue('Criteria 1');
    
    component.createPhase();
    
    expect(mockDiaryService.addPhase).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/contract-progress', 'contract123']);
  });
});
