import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActiveContractsComponent } from './active-contracts.component';
import { ApplicationService } from '../../../../../core/services/application.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('ActiveContractsComponent', () => {
  let component: ActiveContractsComponent;
  let fixture: ComponentFixture<ActiveContractsComponent>;
  let mockApplicationService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockApplicationService = {
      getFreelancerOffers: jasmine.createSpy('getFreelancerOffers').and.returnValue(of({
        success: true,
        offers: [
          {
            id: '1',
            contractId: 'C1',
            client: 'John Doe',
            budget: 1000,
            contractType: 'Fixed Price',
            status: 'Accepted', // Maps to in-progress or upcoming depending on startDate
            startDate: new Date(Date.now() - 86400000).toISOString(), // Past date -> in-progress
            contractStatus: 'Active'
          },
          {
            id: '2',
            contractId: 'C2',
            client: 'Jane Smith',
            budget: 50,
            contractType: 'Hourly',
            status: 'Accepted',
            startDate: new Date(Date.now() - 86400000).toISOString(),
            contractStatus: 'Completed' // Explicit completed
          }
        ]
      })),
      getContractPdfUrl: jasmine.createSpy('getContractPdfUrl').and.returnValue('http://pdf.url')
    };

    mockActivatedRoute = {
      snapshot: { paramMap: { get: () => '1' } }
    };

    await TestBed.configureTestingModule({
      imports: [ActiveContractsComponent],
      providers: [
        { provide: ApplicationService, useValue: mockApplicationService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load contracts via toSignal successfully', fakeAsync(() => {
    tick(); // allow signals to resolve
    expect(mockApplicationService.getFreelancerOffers).toHaveBeenCalled();
    const contracts = component.contracts();
    
    expect(contracts.length).toBe(2);
    // 1st offer mapped to in-progress because start date is past
    expect(contracts[0].status).toBe('in-progress');
    // 2nd offer mapped to completed
    expect(contracts[1].status).toBe('completed');
    
    expect(component.isLoading()).toBeFalse();
  }));

  it('should filter contracts properly based on active tab', fakeAsync(() => {
    tick(); // wait for fetch
    
    // Tab defaults to 'active'
    let filtered = component.filteredContracts();
    expect(filtered.length).toBe(1);
    expect(filtered[0].status).toBe('in-progress');

    // Switch tab to 'completed'
    component.currentTab.set('completed');
    fixture.detectChanges();

    filtered = component.filteredContracts();
    expect(filtered.length).toBe(1);
    expect(filtered[0].status).toBe('completed');
  }));

  it('should fallback gracefully on error', fakeAsync(() => {
    mockApplicationService.getFreelancerOffers.and.returnValue(throwError(() => new Error('Error')));
    
    // Create new fixture to trigger the observable chain with the error mock
    const errorFixture = TestBed.createComponent(ActiveContractsComponent);
    const errorComponent = errorFixture.componentInstance;
    errorFixture.detectChanges();
    tick();
    
    expect(errorComponent.contracts()).toEqual([]);
    expect(errorComponent.isLoading()).toBeFalse();
  }));

  it('should open pdf on download', () => {
    spyOn(window, 'open');
    component.downloadContract('1');
    expect(mockApplicationService.getContractPdfUrl).toHaveBeenCalledWith('1');
    expect(window.open).toHaveBeenCalledWith('http://pdf.url', '_blank');
  });
});
