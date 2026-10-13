import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FreelancerManagement } from './freelancer-management';
import { AdminService } from '../../../core/services/admin.service';
import { ModalService } from '../../../core/services/ui/modal.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FreelancerManagement', () => {
  let component: FreelancerManagement;
  let fixture: ComponentFixture<FreelancerManagement>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;

  const mockFreelancers = [
    { id: 'f1', name: 'John Doe', email: 'john@test.com', title: 'Full Stack Dev', status: 'Active', completedProjects: 5 },
    { id: 'f2', name: 'Jane Smith', email: 'jane@test.com', title: 'UI Designer', status: 'Pending Approval', completedProjects: 0 },
    { id: 'f3', name: 'Bob Wilson', email: 'bob@test.com', title: 'DevOps', status: 'Suspended', completedProjects: 2 }
  ];

  const mockStatusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Pending Approval', value: 'Pending Approval' },
    { label: 'Suspended', value: 'Suspended' }
  ];

  beforeEach(async () => {
    adminServiceSpy = jasmine.createSpyObj('AdminService', [
      'getUserStatusOptions',
      'getAllFreelancers',
      'updateFreelancerStatus',
      'approveFreelancer'
    ]);
    modalServiceSpy = jasmine.createSpyObj('ModalService', ['confirm']);

    adminServiceSpy.getUserStatusOptions.and.returnValue(of(structuredClone(mockStatusOptions)));
    adminServiceSpy.getAllFreelancers.and.returnValue(of(structuredClone(mockFreelancers)));
    adminServiceSpy.updateFreelancerStatus.and.returnValue(of({ success: true }));
    adminServiceSpy.approveFreelancer.and.returnValue(of({ success: true }));

    await TestBed.configureTestingModule({
      imports: [FreelancerManagement],
      providers: [
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: ModalService, useValue: modalServiceSpy },
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FreelancerManagement);
    component = fixture.componentInstance;
  });

  it('should create and load freelancers on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component).toBeTruthy();
    expect(adminServiceSpy.getUserStatusOptions).toHaveBeenCalled();
    expect(adminServiceSpy.getAllFreelancers).toHaveBeenCalled();
    expect(component.totalContracts).toBe(7);
    expect(component.columns.length).toBe(7);
  }));

  it('should filter freelancers by search term and status', fakeAsync(() => {
    fixture.detectChanges();
    tick(300);

    let emittedFreelancers: any[] = [];
    component.freelancers$.subscribe(res => (emittedFreelancers = res));
    tick(300);

    expect(emittedFreelancers.length).toBe(3);

    component.onSearchChange('Jane');
    component.applyFilters();
    tick(300);
    expect(emittedFreelancers.length).toBe(1);
    expect(emittedFreelancers[0].name).toBe('Jane Smith');

    component.onStatusChange('Suspended');
    component.onSearchChange('');
    component.applyFilters();
    tick(300);
    expect(emittedFreelancers.length).toBe(1);
    expect(emittedFreelancers[0].status).toBe('Suspended');

    component.resetFilters();
    tick(300);
    expect(emittedFreelancers.length).toBe(3);
  }));

  it('should remove filter criteria correctly', fakeAsync(() => {
    fixture.detectChanges();
    tick(300);

    component.onSearchChange('John');
    component.onStatusChange('Active');
    component.applyFilters();
    tick(300);

    expect(component.activeFilters.length).toBe(2);

    component.removeFilter({ key: 'search' });
    tick(300);
    expect(component.tempSearchQuery).toBe('');

    component.removeFilter({ key: 'status' });
    tick(300);
    expect(component.tempSelectedStatus).toBe('All Statuses');
  }));

  it('should update freelancer status when confirmed', async () => {
    fixture.detectChanges();
    modalServiceSpy.confirm.and.returnValue(Promise.resolve(true));

    await component.updateStatus('f1', 'Suspended');
    expect(modalServiceSpy.confirm).toHaveBeenCalled();
    expect(adminServiceSpy.updateFreelancerStatus).toHaveBeenCalledWith('f1', 'Suspended');
    expect(adminServiceSpy.getAllFreelancers).toHaveBeenCalled();
  });

  it('should approve pending freelancer when confirmed', async () => {
    fixture.detectChanges();
    modalServiceSpy.confirm.and.returnValue(Promise.resolve(true));

    await component.approveFreelancer('f2');
    expect(modalServiceSpy.confirm).toHaveBeenCalled();
    expect(adminServiceSpy.approveFreelancer).toHaveBeenCalledWith('f2');
    expect(adminServiceSpy.getAllFreelancers).toHaveBeenCalled();
  });

  it('should get proper action items and handle action selections', () => {
    const pendingFreelancer = { id: 'f2', status: 'Pending Approval' };
    const items = component.getActionItems(pendingFreelancer);
    expect(items.some((i: any) => i.value === 'Approve')).toBeTrue();

    spyOn(component, 'approveFreelancer');
    component.onActionSelected({ label: 'Approve', value: 'Approve' }, pendingFreelancer);
    expect(component.approveFreelancer).toHaveBeenCalledWith('f2');

    const activeFreelancer = { id: 'f1', status: 'Active' };
    spyOn(component, 'updateStatus');
    component.onActionSelected({ label: 'Suspend', value: 'Suspended' }, activeFreelancer);
    expect(component.updateStatus).toHaveBeenCalledWith('f1', 'Suspended');

    spyOn(component, 'onActionSelected');
    component.viewFreelancer(activeFreelancer);
    expect(component.onActionSelected).toHaveBeenCalled();
  });

  it('should provide badge variants correctly and handle page size changes', () => {
    expect(component.getBadgeVariant('Active')).toBe('success');
    expect(component.getBadgeVariant('Suspended')).toBe('danger');
    expect(component.getBadgeVariant('Pending Approval')).toBe('warning');

    component.onPageSizeChange(20);
    expect(component.pageSize$.value).toBe(20);
    expect(component.currentPage$.value).toBe(1);
  });
});
