import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactSupportComponent } from './contact-support.component';
import { SupportService } from '../../../core/services/support.service';
import { AuthService } from '../../../core/services/auth.service';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('ContactSupportComponent', () => {
  let component: ContactSupportComponent;
  let fixture: ComponentFixture<ContactSupportComponent>;
  let mockSupportService: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockSupportService = {
      getMyTickets: jasmine.createSpy('getMyTickets').and.returnValue(of({ tickets: [] })),
      createTicket: jasmine.createSpy('createTicket').and.returnValue(of({ success: true })),
      replyToTicket: jasmine.createSpy('replyToTicket').and.returnValue(of({ success: true })),
      resolveTicket: jasmine.createSpy('resolveTicket').and.returnValue(of({ success: true }))
    };

    mockAuthService = {
      currentUser: signal({ role: 'Freelancer', email: 'test@test.com' })
    };

    await TestBed.configureTestingModule({
      imports: [ContactSupportComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SupportService, useValue: mockSupportService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
