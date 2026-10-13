import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ViewReport } from './view-report';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/ui/toast.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ViewReport', () => {
  let component: ViewReport;
  let fixture: ComponentFixture<ViewReport>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  const mockReportResponse = {
    success: true,
    report: {
      id: 'rep-101',
      title: 'Platform Financial Report',
      category: 'Financial'
    },
    data: {
      tableHeaders: [
        { key: 'month', label: 'Month' },
        { key: 'revenue', label: 'Revenue' }
      ],
      tableData: [
        { month: 'Jan', revenue: 1000 },
        { month: 'Feb', revenue: 2000 }
      ],
      chartData: [
        { monthName: 'Jan', value1: 1000, value2: 200 },
        { monthName: 'Feb', value1: 2000, value2: 400 }
      ]
    }
  };

  beforeEach(async () => {
    adminServiceSpy = jasmine.createSpyObj('AdminService', ['getReportData', 'downloadReportFile']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    adminServiceSpy.getReportData.and.returnValue(of(structuredClone(mockReportResponse)));
    adminServiceSpy.downloadReportFile.and.returnValue(of(new Blob(['test-data'], { type: 'application/vnd.ms-excel' })));

    await TestBed.configureTestingModule({
      imports: [ViewReport],
      providers: [
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (key: string) => (key === 'id' ? 'rep-101' : null) })
          }
        },
        DatePipe,
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewReport);
    component = fixture.componentInstance;
  });

  it('should initialize and load report data on param match', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component).toBeTruthy();
    expect(adminServiceSpy.getReportData).toHaveBeenCalledWith('rep-101', 'yearly');
    expect(component.report.id).toBe('rep-101');
    expect(component.tableColumns.length).toBe(2);
    expect(component.isLoading).toBeFalse();
  }));

  it('should change period and reload report data', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.onPeriodChange('h1');
    tick();

    expect(component.periodControl).toBe('h1');
    expect(adminServiceSpy.getReportData).toHaveBeenCalledWith('rep-101', 'h1');
  }));

  it('should download report file successfully', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.downloadReport();
    tick();

    expect(adminServiceSpy.downloadReportFile).toHaveBeenCalledWith('rep-101', 'yearly');
    expect(toastServiceSpy.show).toHaveBeenCalledWith('Report downloaded successfully!', 'success');
    expect(component.isDownloading).toBeFalse();
  }));

  it('should handle download report error', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    adminServiceSpy.downloadReportFile.and.returnValue(throwError(() => new Error('Download failed')));
    component.downloadReport();
    tick();

    expect(toastServiceSpy.show).toHaveBeenCalledWith('Failed to download report.', 'error');
    expect(component.isDownloading).toBeFalse();
  }));

  it('should paginate table data correctly', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component.paginatedData.length).toBe(2);

    component.onPageSizeChange(1);
    expect(component.pageSize).toBe(1);
    expect(component.currentPage).toBe(1);
    expect(component.paginatedData.length).toBe(1);

    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    expect(component.paginatedData.length).toBe(1);
  }));

  it('should identify badge strings correctly', () => {
    expect(component.isBadge('Completed')).toBeTrue();
    expect(component.isBadge('Active')).toBeTrue();
    expect(component.isBadge('UnknownStatus')).toBeFalse();
    expect(component.isBadge(null)).toBeFalse();
  });
});
