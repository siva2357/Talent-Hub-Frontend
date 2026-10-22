import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewContractOffer } from './view-contract-offer';
import { OfferService } from '../../../core/services/offer.service';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ViewContractOffer', () => {
  let component: ViewContractOffer;
  let fixture: ComponentFixture<ViewContractOffer>;

  let mockOfferService: jasmine.SpyObj<OfferService>;
  let sanitizer: DomSanitizer;

  const mockOfferData = {
    _id: 'offer-888',
    createdAt: '2026-03-01T00:00:00.000Z',
    clientId: {
      registrationDetails: {
        fullName: 'Alice Walker'
      }
    },
    freelancerId: {
      registrationDetails: {
        fullName: 'Bob Smith'
      }
    },
    contractId: {
      contractTitle: 'Senior Angular Specialist',
      contractType: 'Fixed Price',
      estimatedBudget: 35000,
      contractSubject: 'Frontend Development',
      contractStartDate: '2026-04-01T00:00:00.000Z',
      contractEndDate: '2026-09-01T00:00:00.000Z'
    }
  };

  beforeEach(async () => {
    mockOfferService = jasmine.createSpyObj('OfferService', ['getOfferById']);

    mockOfferService.getOfferById.and.returnValue(of({
      success: true,
      offer: structuredClone(mockOfferData)
    }));

    await TestBed.configureTestingModule({
      imports: [ViewContractOffer],
      providers: [
        provideRouter([]),
        { provide: OfferService, useValue: mockOfferService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => key === 'id' ? 'offer-888' : null
              }
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    sanitizer = TestBed.inject(DomSanitizer);
    fixture = TestBed.createComponent(ViewContractOffer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit & Data Fetching', () => {
    it('should extract offerId from route, sanitize PDF url, and fetch offer details', () => {
      expect(component.offerId).toBe('offer-888');
      expect(component.safePdfUrl).toBeDefined();
      expect(mockOfferService.getOfferById).toHaveBeenCalledWith('offer-888');
      expect(component.offer).toEqual(mockOfferData);
      expect(component.isLoading).toBeFalse();
    });

    it('should handle API error gracefully when fetching offer details fails', () => {
      spyOn(console, 'error');
      mockOfferService.getOfferById.and.returnValue(throwError(() => new Error('Failed to load offer')));

      component.fetchOfferDetails();

      expect(console.error).toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();
    });

    it('should not sanitize url or fetch details when offerId is missing in route', () => {
      const emptyRoute = {
        snapshot: {
          paramMap: {
            get: () => null
          }
        }
      };
      const mockRouter = { navigate: jasmine.createSpy('navigate') };
      const testComp = new ViewContractOffer(emptyRoute as any, mockRouter as any, mockOfferService, sanitizer);
      testComp.ngOnInit();

      expect(testComp.offerId).toBe('');
      expect(testComp.safePdfUrl).toBeNull();
      expect(mockOfferService.getOfferById).toHaveBeenCalledTimes(1); // from beforeEach only
    });
  });

  describe('Formatting & Helper Methods', () => {
    it('should format budget correctly', () => {
      expect(component.formatBudget(null)).toBe('N/A');
      expect(component.formatBudget(35000)).toContain('35,000');
      expect(component.formatBudget('35000')).toContain('35,000');
      expect(component.formatBudget('invalid')).toBe('invalid');
    });

    it('should format contract type correctly', () => {
      expect(component.formatContractType('')).toBe('Fixed Price');
      expect(component.formatContractType('fixed_price')).toBe('Fixed Price');
      expect(component.formatContractType('hourly_rate')).toBe('Hourly Rate');
    });

    it('should handle declineOffer properly', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      mockOfferService.declineOffer = jasmine.createSpy('declineOffer').and.returnValue(of({ success: true }));

      component.declineOffer();
      expect(mockOfferService.declineOffer).toHaveBeenCalledWith('offer-888');
    });
  });
});
