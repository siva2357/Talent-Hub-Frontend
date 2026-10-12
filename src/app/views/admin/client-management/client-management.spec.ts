import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ClientManagement } from './client-management';
import { AdminService } from '../../../core/services/admin.service';
import { ModalService } from '../../../core/services/ui/modal.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ClientManagement', () => {
  let component: ClientManagement;
  let fixture: ComponentFixture<ClientManagement>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;

  const mockClients = [
    { id: 'c1', name: 'Acme Corp', email: 'acme@test.com', industry: 'Tech', status: 'Active', projectsCount: 3 },
    { id: 'c2', name: 'Beta Ltd', email: 'beta@test.com', industry: 'Finance', status: 'Suspended', projectsCount: 2 },
    { id: 'c3', name: 'Gamma Inc', email: 'gamma@test.com', industry: 'Design', status: 'Blocked', projectsCount: 1 }
  ];

  const mockStatusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Suspended', value: 'Suspended' },
    { label: 'Blocked', value: 'Blocked' },
    { label: 'Pending Approval', value: 'Pending Approval' }
  ];

  beforeEach(async () => {
    adminServiceSpy = jasmine.createSpyObj('AdminService', [
      'getUserStatusOptions',
      'getAllClients',
      'updateClientStatus'
    ]);
    modalServiceSpy = jasmine.createSpyObj('ModalService', ['confirm']);

    adminServiceSpy.getUserStatusOptions.and.returnValue(of(structuredClone(mockStatusOptions)));
    adminServiceSpy.getAllClients.and.returnValue(of(structuredClone(mockClients)));
    adminServiceSpy.updateClientStatus.and.returnValue(of({ success: true }));

    await TestBed.configureTestingModule({
      imports: [ClientManagement],
      providers: [
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: ModalService, useValue: modalServiceSpy },
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientManagement);
    component = fixture.componentInstance;
  });

  it('should create and initialize clients and status options', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component).toBeTruthy();
    expect(adminServiceSpy.getUserStatusOptions).toHaveBeenCalled();
    expect(adminServiceSpy.getAllClients).toHaveBeenCalled();
    expect(component.statusOptions.length).toBe(3); // Pending Approval filtered out
    expect(component.totalContracts).toBe(6);
    expect(component.columns.length).toBe(7);
  }));

  it('should filter clients by search query and status', fakeAsync(() => {
    fixture.detectChanges();
    tick(300);

    let emittedClients: any[] = [];
    component.clients$.subscribe(res => (emittedClients = res));
    tick(300);

    expect(emittedClients.length).toBe(3);

    component.onSearchChange('Acme');
    component.applyFilters();
    tick(300);
    expect(emittedClients.length).toBe(1);
    expect(emittedClients[0].name).toBe('Acme Corp');

    component.onStatusChange('Suspended');
    component.onSearchChange('');
    component.applyFilters();
    tick(300);
    expect(emittedClients.length).toBe(1);
    expect(emittedClients[0].status).toBe('Suspended');

    component.resetFilters();
    tick(300);
    expect(emittedClients.length).toBe(3);
    expect(component.activeFilters.length).toBe(0);
  }));

  it('should remove search and status filters correctly', fakeAsync(() => {
    fixture.detectChanges();
    tick(300);

    component.onSearchChange('Beta');
    component.onStatusChange('Suspended');
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

  it('should change page size and reset current page', () => {
    component.onPageSizeChange(25);
    expect(component.pageSize$.value).toBe(25);
    expect(component.currentPage$.value).toBe(1);
  });

  it('should update client status when confirmed by modal', async () => {
    fixture.detectChanges();
    modalServiceSpy.confirm.and.returnValue(Promise.resolve(true));

    await component.updateStatus('c1', 'Suspended');
    expect(modalServiceSpy.confirm).toHaveBeenCalled();
    expect(adminServiceSpy.updateClientStatus).toHaveBeenCalledWith('c1', 'Suspended');
    expect(adminServiceSpy.getAllClients).toHaveBeenCalled();
  });

  it('should handle different status confirmation prompts properly', async () => {
    fixture.detectChanges();
    modalServiceSpy.confirm.and.returnValue(Promise.resolve(false));

    await component.updateStatus('c1', 'Blocked');
    await component.updateStatus('c1', 'Deactivated');
    await component.updateStatus('c1', 'Active');
    expect(modalServiceSpy.confirm).toHaveBeenCalledTimes(3);
    expect(adminServiceSpy.updateClientStatus).not.toHaveBeenCalled();
  });

  it('should return correct action items and badge variants based on status', () => {
    const activeClient = { id: 'c1', status: 'Active' };
    const items = component.getActionItems(activeClient);
    expect(items.some((i: any) => i.value === 'Suspended')).toBeTrue();
    expect(items.some((i: any) => i.value === 'Blocked')).toBeTrue();
    expect(component.getBadgeVariant('Active')).toBe('success');
    expect(component.getBadgeVariant('Suspended')).toBe('danger');
    expect(component.getBadgeVariant('Blocked')).toBe('warning');

    spyOn(component, 'updateStatus');
    component.onActionSelected({ label: 'Suspend', value: 'Suspended' }, activeClient);
    expect(component.updateStatus).toHaveBeenCalledWith('c1', 'Suspended');

    spyOn(component, 'onActionSelected');
    component.viewClient(activeClient);
    expect(component.onActionSelected).toHaveBeenCalled();
  });
});
