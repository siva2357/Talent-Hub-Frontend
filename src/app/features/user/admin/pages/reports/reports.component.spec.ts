import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminReportsComponent } from './reports.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';

import { of } from 'rxjs';
import { AdminService } from '../../../../../core/services/admin.service';

describe('AdminReportsComponent', () => {
  let component: AdminReportsComponent;
  let fixture: ComponentFixture<AdminReportsComponent>;
  let mockAdminService: any;

  beforeEach(async () => {
    mockAdminService = {
      getReports: jasmine.createSpy('getReports').and.returnValue(of([])),
      getDashboardStats: jasmine.createSpy('getDashboardStats').and.returnValue(of({ totalClients: 10, totalFreelancers: 20 })),
      getFinancialStats: jasmine.createSpy('getFinancialStats').and.returnValue(of({ totalVolume: 1000, platformCommissions: 100, escrowHeld: 50, growthPercent: 5 })),
      getTransactions: jasmine.createSpy('getTransactions').and.returnValue(of([])),
      getClients: jasmine.createSpy('getClients').and.returnValue(of([])),
      getFreelancers: jasmine.createSpy('getFreelancers').and.returnValue(of([])),
      generateReport: jasmine.createSpy('generateReport').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [AdminReportsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AdminService, useValue: mockAdminService },
        { provide: ToastrService, useValue: { success: jasmine.createSpy(), error: jasmine.createSpy(), warning: jasmine.createSpy() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle downloading a report', () => {
    const report: any = { id: '1', title: 'Test Report', category: 'Financial', description: 'Test', generatedDate: '' };
    spyOn(window, 'URL').and.returnValue({ createObjectURL: () => 'blob:url' } as any);
    
    const mockAnchor = document.createElement('a');
    spyOn(document, 'createElement').and.returnValue(mockAnchor);
    spyOn(mockAnchor, 'click');

    component.downloadReport(report);
    
    const toastr = TestBed.inject(ToastrService);
    expect(toastr.success).toHaveBeenCalledWith('Report "Test Report" downloaded successfully!', 'Reports Desk');
  });

  it('should handle generating a report', () => {
    component.newReportTitle.set('Test Title');
    component.newReportCategory.set('Financial');
    component.newReportDesc.set('Test description');
    
    component.onGenerateReport(new Event('submit'));
    
    const toastr = TestBed.inject(ToastrService);
    expect(mockAdminService.generateReport).toHaveBeenCalledWith('Test Title', 'Financial', 'Test description');
    expect(toastr.success).toHaveBeenCalledWith('Spreadsheet generated statefully.', 'Reports Desk');
    expect(component.newReportTitle()).toBe('');
  });
});
