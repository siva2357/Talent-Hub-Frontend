import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactSupport } from './contact-support';
import { SupportService } from '../../../core/services/support.service';
import { AuthService } from '../../../core/services/auth.service';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ContactSupport', () => {
  let component: ContactSupport;
  let fixture: ComponentFixture<ContactSupport>;
  let supportServiceSpy: jasmine.SpyObj<SupportService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockTickets = [
    {
      ticketId: 't1',
      subject: 'Issue with payment',
      category: 'Billing & Payments',
      status: 'Open',
      replies: [],
      attachments: []
    },
    {
      ticketId: 't2',
      subject: 'Waiting user info',
      category: 'Technical Issue',
      status: 'WaitingForUser',
      replies: [],
      attachments: []
    },
    {
      ticketId: 't3',
      subject: 'Old question',
      category: 'General Support',
      status: 'Resolved',
      replies: [],
      attachments: []
    },
    {
      ticketId: 't4',
      subject: 'Archived issue',
      category: 'General Support',
      status: 'Closed',
      replies: [],
      attachments: []
    }
  ];

  beforeEach(async () => {
    supportServiceSpy = jasmine.createSpyObj('SupportService', [
      'getUserTickets',
      'replyToTicketByUser',
      'resolveTicket'
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);

    supportServiceSpy.getUserTickets.and.returnValue(of({
      success: true,
      tickets: structuredClone(mockTickets)
    }));

    await TestBed.configureTestingModule({
      imports: [ContactSupport],
      providers: [
        provideRouter([]),
        { provide: SupportService, useValue: supportServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactSupport);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('fetchTickets and calculateStats', () => {
    it('should load tickets and calculate correct stats on init', () => {
      fixture.detectChanges();

      expect(supportServiceSpy.getUserTickets).toHaveBeenCalled();
      expect(component.tickets.length).toBe(4);
      expect(component.totalTickets).toBe(4);
      expect(component.openTickets).toBe(2); // 'Open' + 'WaitingForUser'
      expect(component.resolvedTickets).toBe(1);
      expect(component.closedTickets).toBe(1);
      expect(component.isLoading).toBeFalse();
    });

    it('should handle error when fetching tickets', () => {
      supportServiceSpy.getUserTickets.and.returnValue(throwError(() => new Error('API failure')));
      spyOn(console, 'error');

      fixture.detectChanges();

      expect(component.isLoading).toBeFalse();
      expect(component.tickets).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('selectTicket', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should select ticket and reset replyMessage', () => {
      component.replyMessage = 'draft message';
      const ticket = component.tickets[0];

      component.selectTicket(ticket);

      expect(component.selectedTicket).toBe(ticket);
      expect(component.replyMessage).toBe('');
    });
  });

  describe('submitReply', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.selectTicket(component.tickets[0]);
    });

    it('should not submit if replyMessage is empty or whitespace', () => {
      component.replyMessage = '   ';
      component.submitReply();

      expect(supportServiceSpy.replyToTicketByUser).not.toHaveBeenCalled();
    });

    it('should not submit if no ticket is selected', () => {
      component.selectedTicket = null;
      component.replyMessage = 'Here is more details';
      component.submitReply();

      expect(supportServiceSpy.replyToTicketByUser).not.toHaveBeenCalled();
    });

    it('should submit reply and append to ticket replies on success', () => {
      component.replyMessage = 'I have uploaded the receipt';
      supportServiceSpy.replyToTicketByUser.and.returnValue(of({ success: true }));

      component.submitReply();

      expect(supportServiceSpy.replyToTicketByUser).toHaveBeenCalledWith('t1', {
        message: 'I have uploaded the receipt',
        attachments: []
      });
      expect(component.selectedTicket.replies.length).toBe(1);
      expect(component.selectedTicket.replies[0].message).toBe('I have uploaded the receipt');
      expect(component.selectedTicket.replies[0].sender).toBe('User');
      expect(component.replyMessage).toBe('');
      expect(component.isReplying).toBeFalse();
    });

    it('should handle reply submission error', () => {
      component.replyMessage = 'Test message';
      supportServiceSpy.replyToTicketByUser.and.returnValue(throwError(() => new Error('Error sending reply')));
      spyOn(console, 'error');

      component.submitReply();

      expect(component.isReplying).toBeFalse();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('resolveTicket', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.selectTicket(component.tickets[0]); // t1 has status 'Open'
    });

    it('should not resolve ticket if user cancels confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.resolveTicket();

      expect(supportServiceSpy.resolveTicket).not.toHaveBeenCalled();
    });

    it('should resolve ticket and recalculate stats on user confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      supportServiceSpy.resolveTicket.and.returnValue(of({ success: true }));

      component.resolveTicket();

      expect(supportServiceSpy.resolveTicket).toHaveBeenCalledWith('t1');
      expect(component.selectedTicket.status).toBe('Resolved');
      expect(component.openTickets).toBe(1);
      expect(component.resolvedTickets).toBe(2);
    });

    it('should handle error when resolving ticket', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      supportServiceSpy.resolveTicket.and.returnValue(throwError(() => new Error('Resolve failed')));
      spyOn(console, 'error');

      component.resolveTicket();

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Helper formatting methods', () => {
    it('should return correct category icon', () => {
      expect(component.getCategoryIcon('Technical Issue')).toBe('bi-wrench-adjustable');
      expect(component.getCategoryIcon('Billing & Payments')).toBe('bi-receipt');
      expect(component.getCategoryIcon('Unknown')).toBe('bi-ticket');
    });

    it('should return correct category background class', () => {
      expect(component.getCategoryBg('Technical Issue')).toContain('text-success');
      expect(component.getCategoryBg('Disputes & Resolution')).toContain('text-danger');
      expect(component.getCategoryBg('Unknown')).toBe('bg-primary bg-opacity-10 text-primary');
    });

    it('should return correct status badge class', () => {
      expect(component.getStatusBadgeClass('Open')).toContain('border-primary');
      expect(component.getStatusBadgeClass('Resolved')).toContain('border-success');
      expect(component.getStatusBadgeClass('Other')).toBe('bg-primary bg-opacity-10 text-primary');
    });
  });
});
