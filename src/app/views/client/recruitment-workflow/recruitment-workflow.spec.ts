import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecruitmentWorkflow } from './recruitment-workflow';
import { ApplicationService } from '../../../core/services/application.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('RecruitmentWorkflow', () => {
  let component: RecruitmentWorkflow;
  let fixture: ComponentFixture<RecruitmentWorkflow>;
  let mockApplicationService: jasmine.SpyObj<ApplicationService>;

  beforeEach(async () => {
    mockApplicationService = jasmine.createSpyObj('ApplicationService', [
      'getApplicationById',
      'shortlistApplication',
      'rejectApplication',
      'interviewResult',
      'scheduleAssessment',
      'assessmentResult',
      'scheduleInterview',
      'finalizeApplication'
    ]);

    mockApplicationService.getApplicationById.and.returnValue(of({
      success: true,
      application: {
        _id: 'app123',
        applicationStatus: 'application submitted',
        updatedAt: new Date().toISOString(),
        clientId: { registrationDetails: { fullName: 'Test Client' } }
      }
    }));

    await TestBed.configureTestingModule({
      imports: [RecruitmentWorkflow, CommonModule, FormsModule],
      providers: [
        { provide: ApplicationService, useValue: mockApplicationService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RecruitmentWorkflow);
    component = fixture.componentInstance;
    component.applicationId = 'app123';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch application details on init', () => {
    component.ngOnChanges({
      applicationId: {
        currentValue: 'app123',
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });
    expect(mockApplicationService.getApplicationById).toHaveBeenCalledWith('app123');
    expect(component.applicationDetails).toBeTruthy();
    expect(component.isLoading).toBeFalse();
  });

  it('should emit close event on closeModal', () => {
    spyOn(component.close, 'emit');
    component.closeModal();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should shortlist candidate', () => {
    mockApplicationService.shortlistApplication.and.returnValue(of({ success: true }));
    component.shortlistCandidate();
    expect(mockApplicationService.shortlistApplication).toHaveBeenCalledWith('app123');
    expect(mockApplicationService.getApplicationById).toHaveBeenCalledTimes(1);
  });

  it('should reject candidate', () => {
    mockApplicationService.rejectApplication.and.returnValue(of({ success: true }));
    component.rejectCandidate();
    expect(mockApplicationService.rejectApplication).toHaveBeenCalledWith('app123');
    expect(mockApplicationService.getApplicationById).toHaveBeenCalledTimes(1);
  });

  it('should assign assessment when valid', () => {
    component.assessmentDetails = { title: 'Test Test', date: '2025-01-01', description: '' };
    mockApplicationService.scheduleAssessment.and.returnValue(of({ success: true }));
    component.assignAssessment();
    expect(mockApplicationService.scheduleAssessment).toHaveBeenCalledWith('app123', component.assessmentDetails);
  });

  it('should not assign assessment when invalid', () => {
    spyOn(window, 'alert');
    component.assessmentDetails = { title: '', date: '', description: '' };
    component.assignAssessment();
    expect(window.alert).toHaveBeenCalledWith('Please fill out title and date');
    expect(mockApplicationService.scheduleAssessment).not.toHaveBeenCalled();
  });
});
