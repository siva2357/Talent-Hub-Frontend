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
      const testComp = new ViewContractOffer(emptyRoute as any, mockOfferService, sanitizer);
      testComp.ngOnInit();

      expect(testComp.offerId).toBe('');
      expect(testComp.safePdfUrl).toBeNull();
      expect(mockOfferService.getOfferById).toHaveBeenCalledTimes(1); // from beforeEach only
    });
  });

  describe('Stats Getter', () => {
    it('should return empty stats array when offer is null', () => {
      component.offer = null;
      expect(component.stats).toEqual([]);
    });

    it('should map and format all 9 stat cards correctly when offer is loaded', () => {
      const stats = component.stats;
      expect(stats.length).toBe(9);

      expect(stats[0].title).toBe('Client');
      expect(stats[0].value).toBe('Alice Walker');

      expect(stats[1].title).toBe('Contractor');
      expect(stats[1].value).toBe('Bob Smith');

      expect(stats[2].title).toBe('Contract Title');
      expect(stats[2].value).toBe('Senior Angular Specialist');

      expect(stats[3].title).toBe('Contract Type');
      expect(stats[3].value).toBe('Fixed Price');

      expect(stats[4].title).toBe('Budget');
      expect(stats[4].value).toBe('₹35000');

      expect(stats[5].title).toBe('Category');
      expect(stats[5].value).toBe('Frontend Development');

      expect(stats[6].title).toBe('Offer Date');
      expect(stats[6].value).toBe('Mar 1, 2026');

      expect(stats[7].title).toBe('Start Date');
      expect(stats[7].value).toBe('Apr 1, 2026');

      expect(stats[8].title).toBe('End Date');
      expect(stats[8].value).toBe('Sep 1, 2026');
    });

    it('should fallback to default values and "N/A" for missing offer fields', () => {
      component.offer = {
        clientId: null,
        freelancerId: null,
        contractId: null,
        createdAt: null
      };

      const stats = component.stats;
      expect(stats.length).toBe(9);
      expect(stats[0].value).toBe('N/A');
      expect(stats[1].value).toBe('N/A');
      expect(stats[2].value).toBe('N/A');
      expect(stats[3].value).toBe('Fixed Price');
      expect(stats[4].value).toBe('₹N/A');
      expect(stats[5].value).toBe('N/A');
      expect(stats[6].value).toBe('N/A');
      expect(stats[7].value).toBe('N/A');
      expect(stats[8].value).toBe('N/A');
    });
  });
});
