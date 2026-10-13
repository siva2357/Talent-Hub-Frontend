import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LegalContractPage } from './legal-contract-page';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OfferService } from '../../../core/services/offer.service';
import { ApplicationService } from '../../../core/services/application.service';
import { FileService } from '../../../core/services/file.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LegalContractPage', () => {
  let component: LegalContractPage;
  let fixture: ComponentFixture<LegalContractPage>;
  let mockOfferService: jasmine.SpyObj<OfferService>;
  let mockApplicationService: jasmine.SpyObj<ApplicationService>;
  let mockFileService: jasmine.SpyObj<FileService>;
  let router: Router;

  beforeEach(async () => {
    mockOfferService = jasmine.createSpyObj('OfferService', ['createOffer']);
    mockApplicationService = jasmine.createSpyObj('ApplicationService', ['getApplicationById']);
    mockFileService = jasmine.createSpyObj('FileService', ['uploadFile']);

    mockApplicationService.getApplicationById.and.returnValue(of({
      success: true,
      application: {
        _id: 'app123',
        contractId: { _id: 'contract123' },
        clientId: { _id: 'client123' }
      }
    }));

    await TestBed.configureTestingModule({
      imports: [LegalContractPage, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: OfferService, useValue: mockOfferService },
        { provide: ApplicationService, useValue: mockApplicationService },
        { provide: FileService, useValue: mockFileService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'app123' } } }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LegalContractPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch application details on init', () => {
    expect(mockApplicationService.getApplicationById).toHaveBeenCalledWith('app123');
    expect(component.applicationData).toBeTruthy();
    expect(component.contractId).toBe('contract123');
    expect(component.isLoading).toBeFalse();
  });

  it('should initialize form with empty values and false checkboxes', () => {
    expect(component.offerForm).toBeTruthy();
    expect(component.offerForm.get('scopeOfWork')?.value).toBe('');
    expect(component.offerForm.get('clientSignature')?.value).toBe('');
    expect(component.offerForm.get('confirmAccuracy')?.value).toBeFalse();
  });

  it('should update form on upload complete', () => {
    component.onUploadComplete('https://example.com/sig.png');
    expect(component.signaturePreview).toBe('https://example.com/sig.png');
    expect(component.offerForm.get('clientSignature')?.value).toBe('https://example.com/sig.png');
  });

  it('should not submit if form is invalid', () => {
    component.onSubmit();
    expect(mockOfferService.createOffer).not.toHaveBeenCalled();
    expect(component.offerForm.get('scopeOfWork')?.touched).toBeTrue();
  });

  it('should submit if form is valid', () => {
    mockOfferService.createOffer.and.returnValue(of({ success: true }));
    
    component.offerForm.patchValue({
      scopeOfWork: 'Test scope',
      additionalTerms: 'Test terms',
      clientSignature: 'https://example.com/sig.png',
      confirmAccuracy: true,
      confirmSignatureAuth: true,
      confirmLegallyBinding: true,
      confirmTermsPrivacy: true
    });

    expect(component.offerForm.valid).toBeTrue();
    const navigateSpy = spyOn(router, 'navigate');
    component.onSubmit();

    expect(component.isSubmitting).toBeTrue();
    expect(mockOfferService.createOffer).toHaveBeenCalledWith('app123', {
      scopeOfWork: 'Test scope',
      additionalTerms: 'Test terms',
      clientSignature: 'https://example.com/sig.png',
      status: 'pending'
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/applicants', 'contract123']);
  });
});
