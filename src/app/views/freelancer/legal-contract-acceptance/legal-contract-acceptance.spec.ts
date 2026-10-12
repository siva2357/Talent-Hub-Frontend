import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LegalContractAcceptance } from './legal-contract-acceptance';
import { OfferService } from '../../../core/services/offer.service';
import { FileService } from '../../../core/services/file.service';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LegalContractAcceptance', () => {
  let component: LegalContractAcceptance;
  let fixture: ComponentFixture<LegalContractAcceptance>;

  let mockOfferService: jasmine.SpyObj<OfferService>;
  let mockFileService: jasmine.SpyObj<FileService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let sanitizer: DomSanitizer;

  const mockOfferData = {
    _id: 'offer-555',
    contractTitle: 'Senior Cloud DevOps Engineer',
    clientName: 'Global Cloud Systems',
    status: 'Pending',
    rate: 4500,
    terms: 'Standard Master Services Agreement'
  };

  beforeEach(async () => {
    mockOfferService = jasmine.createSpyObj('OfferService', [
      'getOfferById',
      'signOffer'
    ]);
    mockFileService = jasmine.createSpyObj('FileService', ['uploadFile']);

    mockOfferService.getOfferById.and.returnValue(of({
      success: true,
      offer: structuredClone(mockOfferData)
    }));

    await TestBed.configureTestingModule({
      imports: [LegalContractAcceptance],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: OfferService, useValue: mockOfferService },
        { provide: FileService, useValue: mockFileService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => key === 'id' ? 'offer-555' : null
              }
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spyOn(mockRouter, 'navigate');
    sanitizer = TestBed.inject(DomSanitizer);

    fixture = TestBed.createComponent(LegalContractAcceptance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization & Offer Loading', () => {
    it('should extract offerId from route and load offer details', () => {
      expect(component.offerId).toBe('offer-555');
      expect(mockOfferService.getOfferById).toHaveBeenCalledWith('offer-555');
      expect(component.offer).toEqual(mockOfferData);
      expect(component.isLoading).toBeFalse();
    });

    it('should handle error when fetching offer details fails', () => {
      spyOn(console, 'error');
      mockOfferService.getOfferById.and.returnValue(throwError(() => new Error('Offer not found')));

      component.fetchOfferDetails();

      expect(console.error).toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();
    });

    it('should not call fetchOfferDetails if offerId is missing in route', () => {
      const emptyRoute = {
        snapshot: {
          paramMap: {
            get: () => null
          }
        }
      };
      const testComp = new LegalContractAcceptance(
        emptyRoute as any,
        mockRouter,
        mockOfferService,
        mockFileService,
        sanitizer
      );

      testComp.ngOnInit();
      expect(testComp.offerId).toBe('');
      expect(mockOfferService.getOfferById).toHaveBeenCalledTimes(1); // from beforeEach only
    });

    it('should sanitize and return safe PDF url', () => {
      spyOn(sanitizer, 'bypassSecurityTrustResourceUrl').and.callThrough();
      const safeUrl = component.getSafePdfUrl();

      expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(
        'http://localhost:5000/api/offers/offer-555/pdf'
      );
      expect(safeUrl).toBeDefined();
    });
  });

  describe('Signature Selection & Upload', () => {
    it('should handle onFileSelected and read data URL preview', fakeAsync(() => {
      const blob = new Blob(['signature-bytes'], { type: 'image/png' });
      const file = new File([blob], 'signature.png', { type: 'image/png' });

      component.onFileSelected(file);

      expect(component.signatureFile).toBe(file);
      expect(component.isUploading).toBeTrue();

      tick();

      expect(component.signaturePreview).toBeDefined();
    }));

    it('should handle onUploadComplete', () => {
      component.isUploading = true;
      component.onUploadComplete('https://cdn.example.com/signatures/sig-123.png');

      expect(component.isUploading).toBeFalse();
      expect(component.uploadedSignatureUrl).toBe('https://cdn.example.com/signatures/sig-123.png');
    });
  });

  describe('Accept Contract Validation Guards', () => {
    it('should alert if signature is still uploading', () => {
      spyOn(window, 'alert');
      component.isUploading = true;

      component.acceptContract();

      expect(window.alert).toHaveBeenCalledWith('Please wait for your signature to finish uploading.');
      expect(mockOfferService.signOffer).not.toHaveBeenCalled();
    });

    it('should alert if any consent checkbox is unchecked', () => {
      spyOn(window, 'alert');
      component.isUploading = false;
      component.consent1 = true;
      component.consent2 = true;
      component.consent3 = true;
      component.consent4 = false; // Missing consent 4

      component.acceptContract();

      expect(window.alert).toHaveBeenCalledWith('Please check all consent boxes to agree to the legal terms.');
      expect(mockOfferService.signOffer).not.toHaveBeenCalled();
    });

    it('should alert if digital signature url is missing', () => {
      spyOn(window, 'alert');
      component.isUploading = false;
      component.consent1 = true;
      component.consent2 = true;
      component.consent3 = true;
      component.consent4 = true;
      component.uploadedSignatureUrl = '';

      component.acceptContract();

      expect(window.alert).toHaveBeenCalledWith('Please upload your digital signature first.');
      expect(mockOfferService.signOffer).not.toHaveBeenCalled();
    });
  });

  describe('Contract Signing Flow', () => {
    beforeEach(() => {
      component.isUploading = false;
      component.consent1 = true;
      component.consent2 = true;
      component.consent3 = true;
      component.consent4 = true;
      component.uploadedSignatureUrl = 'https://cdn.example.com/signatures/my-sig.png';
    });

    it('should sign offer successfully and navigate to /my-contracts', () => {
      mockOfferService.signOffer.and.returnValue(of({
        success: true,
        message: 'Offer signed successfully'
      }));

      component.acceptContract();

      expect(mockOfferService.signOffer).toHaveBeenCalledWith('offer-555', {
        freelancerSignature: 'https://cdn.example.com/signatures/my-sig.png'
      });
      expect(component.isSubmitting).toBeFalse();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/my-contracts']);
    });

    it('should alert message when signOffer returns success false', () => {
      spyOn(window, 'alert');
      mockOfferService.signOffer.and.returnValue(of({
        success: false
      }));

      component.acceptContract();

      expect(window.alert).toHaveBeenCalledWith('Failed to accept contract. Please try again.');
      expect(component.isSubmitting).toBeFalse();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should handle error when signOffer API call fails', () => {
      spyOn(console, 'error');
      spyOn(window, 'alert');
      mockOfferService.signOffer.and.returnValue(throwError(() => new Error('Signing error')));

      component.acceptContract();

      expect(console.error).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('An error occurred while accepting the contract.');
      expect(component.isSubmitting).toBeFalse();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});
