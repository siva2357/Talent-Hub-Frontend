import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupportRequestsComponent } from './support-requests.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';

describe('SupportRequestsComponent', () => {
  let component: SupportRequestsComponent;
  let fixture: ComponentFixture<SupportRequestsComponent>;
  let mockToastr: any;

  beforeEach(async () => {
    mockToastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      info: jasmine.createSpy('info'),
      warning: jasmine.createSpy('warning')
    };

    await TestBed.configureTestingModule({
      imports: [SupportRequestsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ToastrService, useValue: mockToastr }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SupportRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
