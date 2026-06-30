import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LegalContractComponent } from './legal-contract.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ApplicationService } from '../../../../../core/services/application.service';

describe('LegalContractComponent', () => {
  let component: LegalContractComponent;
  let fixture: ComponentFixture<LegalContractComponent>;
  let mockApplicationService: any;

  beforeEach(async () => {
    mockApplicationService = {
      getApplicationById: jasmine.createSpy('getApplicationById').and.returnValue(of({
        success: true,
        application: {
          contractId: {
            contractTitle: 'Test Contract',
            budgetType: 'Hourly',
            estimatedBudget: 50
          },
          clientId: {
            registrationDetails: { fullName: 'Client Name' }
          }
        }
      })),
      getContractPdfUrl: jasmine.createSpy('getContractPdfUrl').and.returnValue('mock-url'),
      signOffer: jasmine.createSpy('signOffer').and.returnValue(of({ success: true }))
    };

    await TestBed.configureTestingModule({
      imports: [LegalContractComponent, RouterTestingModule],
      providers: [
        { provide: ApplicationService, useValue: mockApplicationService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => '123' })
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load offer details on init', () => {
    expect(component.offerId()).toBe('123');
    expect(mockApplicationService.getApplicationById).toHaveBeenCalledWith('123');
    expect(component.offerData()?.contractId?.contractTitle).toBe('Test Contract');
    expect(component.isLoading()).toBeFalse();
  });

  it('should update signature image on file select', () => {
    const mockFile = new File([''], 'test.png', { type: 'image/png' });
    const mockEvent = { target: { files: [mockFile] } };
    
    // Mock FileReader
    const mockReader = jasmine.createSpyObj('FileReader', ['readAsDataURL']);
    spyOn(window as any, 'FileReader').and.returnValue(mockReader);
    
    component.onSignatureFileSelected(mockEvent);
    expect(mockReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
  });

  it('should not sign contract if conditions are not met', () => {
    component.hasAgreed.set(false);
    component.signatureImage.set(null);
    component.signContract();
    expect(mockApplicationService.signOffer).not.toHaveBeenCalled();
  });

  it('should sign contract successfully', fakeAsync(() => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    spyOn(window, 'alert');
    
    component.hasAgreed.set(true);
    component.signatureImage.set('data:image/png;base64,xxx');
    component.signContract();
    tick();
    
    expect(mockApplicationService.signOffer).toHaveBeenCalledWith('123', { signatureImage: 'data:image/png;base64,xxx' });
    expect(component.isSigning()).toBeFalse();
    expect(window.alert).toHaveBeenCalledWith('Contract accepted, signed, and activated successfully!');
    expect(router.navigate).toHaveBeenCalledWith(['/user/contracts']);
  }));
});
