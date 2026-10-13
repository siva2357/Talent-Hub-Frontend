import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateTicket } from './create-ticket';
import { SupportService } from '../../../core/services/support.service';
import { FileService } from '../../../core/services/file.service';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CreateTicket', () => {
  let component: CreateTicket;
  let fixture: ComponentFixture<CreateTicket>;
  let supportServiceSpy: jasmine.SpyObj<SupportService>;
  let fileServiceSpy: jasmine.SpyObj<FileService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  let router: Router;

  beforeEach(async () => {
    supportServiceSpy = jasmine.createSpyObj('SupportService', ['createTicket']);
    fileServiceSpy = jasmine.createSpyObj('FileService', ['uploadFile']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    tokenServiceSpy = jasmine.createSpyObj('TokenService', ['getRole', 'getToken']);

    await TestBed.configureTestingModule({
      imports: [CreateTicket],
      providers: [
        provideRouter([]),
        { provide: SupportService, useValue: supportServiceSpy },
        { provide: FileService, useValue: fileServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TokenService, useValue: tokenServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(CreateTicket);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize the form', () => {
    expect(component).toBeTruthy();
    expect(component.ticketForm).toBeDefined();
    expect(component.ticketForm.invalid).toBeTrue();
    expect(component.attachments).toEqual([]);
    expect(component.isSubmitting).toBeFalse();
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const subject = component.ticketForm.controls['subject'];
      const category = component.ticketForm.controls['category'];
      const description = component.ticketForm.controls['description'];

      expect(subject.hasError('required')).toBeTrue();
      expect(category.hasError('required')).toBeTrue();
      expect(description.hasError('required')).toBeTrue();

      subject.setValue('A'.repeat(151));
      expect(subject.hasError('maxlength')).toBeTrue();

      description.setValue('B'.repeat(1001));
      expect(description.hasError('maxlength')).toBeTrue();

      subject.setValue('Need help with payment');
      category.setValue('Billing & Payments');
      description.setValue('Payment failed on card checkout');
      expect(component.ticketForm.valid).toBeTrue();
    });

    it('should update category via setCategory', () => {
      component.setCategory('Technical Issue');
      expect(component.ticketForm.controls['category'].value).toBe('Technical Issue');
    });
  });

  describe('Attachments', () => {
    it('should add attachments when count is under 5', () => {
      component.onUploadComplete('https://cdn.example.com/receipt1.pdf');
      expect(component.attachments.length).toBe(1);
      expect(component.attachments[0]).toEqual({ name: 'receipt1.pdf', url: 'https://cdn.example.com/receipt1.pdf' });

      component.onUploadComplete('https://cdn.example.com/screenshot2.png');
      expect(component.attachments.length).toBe(2);
    });

    it('should enforce maximum of 5 attachments', () => {
      for (let i = 1; i <= 6; i++) {
        component.onUploadComplete(`https://cdn.example.com/file${i}.pdf`);
      }
      expect(component.attachments.length).toBe(5);
    });

    it('should remove attachment by index', () => {
      component.onUploadComplete('https://cdn.example.com/file1.pdf');
      component.onUploadComplete('https://cdn.example.com/file2.pdf');

      component.removeAttachment(0);
      expect(component.attachments.length).toBe(1);
      expect(component.attachments[0].name).toBe('file2.pdf');
    });
  });

  describe('Submission', () => {
    it('should not submit if form is invalid and marks controls touched', async () => {
      await component.onSubmit();
      expect(supportServiceSpy.createTicket).not.toHaveBeenCalled();
      expect(component.ticketForm.controls['subject'].touched).toBeTrue();
      expect(component.ticketForm.controls['category'].touched).toBeTrue();
      expect(component.ticketForm.controls['description'].touched).toBeTrue();
    });

    it('should submit successfully and navigate to /contact-support', fakeAsync(() => {
      component.ticketForm.setValue({
        subject: 'Invoice not received',
        category: 'Billing & Payments',
        description: 'I did not receive the invoice for March.'
      });
      component.attachments = [{ name: 'doc.pdf', url: 'https://cdn.example.com/doc.pdf' }];

      supportServiceSpy.createTicket.and.returnValue(of({ success: true }));

      component.onSubmit();
      tick();

      expect(supportServiceSpy.createTicket).toHaveBeenCalledWith({
        subject: 'Invoice not received',
        category: 'Billing & Payments',
        description: 'I did not receive the invoice for March.',
        attachments: [{ name: 'doc.pdf', url: 'https://cdn.example.com/doc.pdf' }]
      });
      expect(router.navigate).toHaveBeenCalledWith(['/contact-support']);
      expect(component.isSubmitting).toBeFalse();
    }));

    it('should handle submission error and alert user', fakeAsync(() => {
      component.ticketForm.setValue({
        subject: 'Crash issue',
        category: 'Technical Issue',
        description: 'Page crashes on load.'
      });

      spyOn(window, 'alert');
      spyOn(console, 'error');
      supportServiceSpy.createTicket.and.returnValue(throwError(() => new Error('Server error')));

      component.onSubmit();
      tick();

      expect(window.alert).toHaveBeenCalledWith('Failed to create ticket. Please try again.');
      expect(component.isSubmitting).toBeFalse();
      expect(router.navigate).not.toHaveBeenCalled();
    }));
  });
});
