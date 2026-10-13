import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Applicants } from './applicants';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { ContractService } from '../../../core/services/contract.service';
import { ApplicationService } from '../../../core/services/application.service';
import { MasterDataService } from '../../../core/services/master-data.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Applicants', () => {
  let component: Applicants;
  let fixture: ComponentFixture<Applicants>;

  let mockContractService: jasmine.SpyObj<ContractService>;
  let mockApplicationService: jasmine.SpyObj<ApplicationService>;
  let mockMasterDataService: jasmine.SpyObj<MasterDataService>;
  let mockActivatedRoute: any;
  let router: Router;

  beforeEach(async () => {
    mockContractService = jasmine.createSpyObj('ContractService', ['getContractApplicants']);
    mockApplicationService = jasmine.createSpyObj('ApplicationService', ['']);
    mockMasterDataService = jasmine.createSpyObj('MasterDataService', ['getAllMasterData']);

    mockActivatedRoute = {
      paramMap: of(new Map([['id', 'contract-123']]))
    };

    mockMasterDataService.getAllMasterData.and.returnValue(of({
      success: true,
      data: {
        ApplicationStatus: [{ key: 'pending', value: 'Pending' }],
        Gender: [{ key: 'male', value: 'Male' }],
        OfferStatus: [{ key: 'sent', value: 'Sent' }]
      }
    }));

    mockContractService.getContractApplicants.and.returnValue(of({
      success: true,
      applicants: [
        {
          applicationId: 'app-1',
          freelancer: { fullName: 'John Doe', email: 'john@example.com', gender: 'male' },
          applicationStatus: 'pending',
          offerStatus: 'none'
        }
      ],
      totalApplicants: 1
    }));

    await TestBed.configureTestingModule({
      imports: [Applicants],
      providers: [
        provideRouter([]),
        { provide: ContractService, useValue: mockContractService },
        { provide: ApplicationService, useValue: mockApplicationService },
        { provide: MasterDataService, useValue: mockMasterDataService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Applicants);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch master data on init', () => {
    expect(mockMasterDataService.getAllMasterData).toHaveBeenCalled();
    expect(component.statusOptions.length).toBeGreaterThan(1);
    expect(component.genderOptions.length).toBeGreaterThan(1);
  });

  it('should fetch applicants on init when contract ID is present', () => {
    expect(mockContractService.getContractApplicants).toHaveBeenCalledWith('contract-123');
    expect(component.applicants.length).toBe(1);
    expect(component.totalApplicants).toBe(1);
  });

  it('should filter applicants by search query', fakeAsync(() => {
    component.searchQuery = 'John';
    component.applyFilters();
    tick();
    expect(component.filteredApplicants.length).toBe(1);

    component.searchQuery = 'Jane';
    component.applyFilters();
    tick();
    expect(component.filteredApplicants.length).toBe(0);
  }));

  it('should reset filters correctly', fakeAsync(() => {
    component.searchQuery = 'Jane';
    component.applyFilters();
    tick();
    expect(component.filteredApplicants.length).toBe(0);

    component.resetFilters();
    tick();
    expect(component.searchQuery).toBe('');
    expect(component.selectedStatus).toBe('all');
    expect(component.filteredApplicants.length).toBe(1); // back to all
  }));

  it('should format status badge variants correctly', () => {
    expect(component.getStatusBadgeVariant('hired')).toBe('success');
    expect(component.getStatusBadgeVariant('rejected')).toBe('danger');
    expect(component.getStatusBadgeVariant('pending')).toBe('warning');
    expect(component.getStatusBadgeVariant('interviewing')).toBe('primary');
  });

  it('should navigate to profile on dropdown action', () => {
    component.onDropdownAction({ label: 'View Profile', value: 'profile', icon: '' }, {});
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });
});
