import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SupportRequest } from './support-request';
import { SupportService } from '../../../core/services/support.service';
import { MasterDataService } from '../../../core/services/master-data.service';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SupportRequest', () => {
  let component: SupportRequest;
  let fixture: ComponentFixture<SupportRequest>;
  let supportServiceSpy: jasmine.SpyObj<SupportService>;
  let masterDataServiceSpy: jasmine.SpyObj<MasterDataService>;

  const mockTickets = [
    { ticketId: 'TCK-001', subject: 'Payment Issue', userName: 'Alice', status: 'Open', category: 'Billing', replies: [] },
    { ticketId: 'TCK-002', subject: 'Account Verification', userName: 'Bob', status: 'WaitingForAdmin', category: 'Account', replies: [] },
    { ticketId: 'TCK-003', subject: 'Bug Report', userName: 'Charlie', status: 'Resolved', category: 'Technical', replies: [] }
  ];

  const mockStatuses = [
    { key: 'Open', value: 'Open' },
    { key: 'WaitingForAdmin', value: 'Waiting for Admin' },
    { key: 'Resolved', value: 'Resolved' }
  ];

  const mockCategories = [
    { key: 'Billing', value: 'Billing' },
    { key: 'Account', value: 'Account' },
    { key: 'Technical', value: 'Technical' }
  ];

  beforeEach(async () => {
    supportServiceSpy = jasmine.createSpyObj('SupportService', [
      'getAllTicketsAdmin',
      'replyToTicketAdmin',
      'updateTicketStatus'
    ]);
    masterDataServiceSpy = jasmine.createSpyObj('MasterDataService', ['getMasterDataByCategory']);

    supportServiceSpy.getAllTicketsAdmin.and.returnValue(of({ success: true, tickets: structuredClone(mockTickets) }));
    supportServiceSpy.replyToTicketAdmin.and.returnValue(of({ success: true, reply: { message: 'We are investigating.' } }));
    supportServiceSpy.updateTicketStatus.and.returnValue(of({ success: true }));

    masterDataServiceSpy.getMasterDataByCategory.and.callFake((cat: string) => {
      if (cat === 'SupportTicketStatus') {
        return of({ success: true, data: structuredClone(mockStatuses) });
      }
      return of({ success: true, data: structuredClone(mockCategories) });
    });

    await TestBed.configureTestingModule({
      imports: [SupportRequest],
      providers: [
        { provide: SupportService, useValue: supportServiceSpy },
        { provide: MasterDataService, useValue: masterDataServiceSpy },
        DatePipe,
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SupportRequest);
    component = fixture.componentInstance;
  });

  it('should initialize and load tickets and master data', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component).toBeTruthy();
    expect(supportServiceSpy.getAllTicketsAdmin).toHaveBeenCalled();
    expect(masterDataServiceSpy.getMasterDataByCategory).toHaveBeenCalledWith('SupportTicketStatus');
    expect(masterDataServiceSpy.getMasterDataByCategory).toHaveBeenCalledWith('SupportTicketCategory');
    expect(component.rawTickets$.value.length).toBe(3);
    expect(component.statusOptions.length).toBe(4);
    expect(component.categoryOptions.length).toBe(4);
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle fetch tickets error gracefully', fakeAsync(() => {
    supportServiceSpy.getAllTicketsAdmin.and.returnValue(throwError(() => new Error('Error')));
    component.fetchTickets();
    tick();

    expect(component.isLoading).toBeFalse();
  }));

  it('should filter tickets by search, status, and category', fakeAsync(() => {
    fixture.detectChanges();
    tick(300);

    let filtered: any[] = [];
    component.filteredTickets$.subscribe(res => (filtered = res));
    tick(300);

    expect(filtered.length).toBe(3);

    component.onSearchChange('Alice');
    component.applyFilters();
    tick(300);
    expect(filtered.length).toBe(1);
    expect(filtered[0].userName).toBe('Alice');

    component.onSearchChange('');
    component.onStatusChange('WaitingForAdmin');
    component.applyFilters();
    tick(300);
    expect(filtered.length).toBe(1);
    expect(filtered[0].status).toBe('WaitingForAdmin');

    component.onStatusChange('');
    component.onCategoryChange('Technical');
    component.applyFilters();
    tick(300);
    expect(filtered.length).toBe(1);
    expect(filtered[0].category).toBe('Technical');

    component.resetFilters();
    tick(300);
    expect(filtered.length).toBe(3);
  }));

  it('should remove filter criteria properly', fakeAsync(() => {
    fixture.detectChanges();
    tick(300);

    component.onSearchChange('Bug');
    component.onStatusChange('Resolved');
    component.onCategoryChange('Technical');
    component.applyFilters();
    tick(300);

    expect(component.activeFilters.length).toBe(3);

    component.removeFilter({ key: 'search' });
    tick(300);
    expect(component.localSearchTerm).toBe('');

    component.removeFilter({ key: 'status' });
    tick(300);
    expect(component.localStatusFilter).toBe('');

    component.removeFilter({ key: 'category' });
    tick(300);
    expect(component.localCategoryFilter).toBe('');
  }));

  it('should select ticket and submit reply', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const ticket = structuredClone(mockTickets[0]);
    component.selectTicket(ticket);
    expect(component.selectedTicket).toBe(ticket);

    component.replyMessage = 'Here is the resolution.';
    component.submitReply();
    tick();

    expect(supportServiceSpy.replyToTicketAdmin).toHaveBeenCalledWith('TCK-001', {
      message: 'Here is the resolution.',
      attachments: []
    });
    expect(component.replyMessage).toBe('');
    expect(component.isReplying).toBeFalse();
  }));

  it('should update ticket status', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.selectedTicket = structuredClone(mockTickets[0]);
    component.changeStatus('Resolved');
    tick();

    expect(supportServiceSpy.updateTicketStatus).toHaveBeenCalledWith('TCK-001', 'Resolved');
    expect(component.selectedTicket.status).toBe('Resolved');
  }));

  it('should return proper badge class for statuses', () => {
    expect(component.getStatusBadgeClass('Open')).toContain('border-primary');
    expect(component.getStatusBadgeClass('Resolved')).toContain('border-success');
    expect(component.getStatusBadgeClass('Other')).toContain('bg-primary');
  });
});
