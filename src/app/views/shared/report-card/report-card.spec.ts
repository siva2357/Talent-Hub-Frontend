import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportCard } from './report-card';
import { AdminService } from '../../../core/services/admin.service';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Report } from '../../../core/models/report.model';

describe('ReportCard', () => {
  let component: ReportCard;
  let fixture: ComponentFixture<ReportCard>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  const mockReport: Report = {
    id: 'rep-1',
    title: 'Financial Quarterly Report',
    description: 'Overview of revenue and disbursements',
    category: 'Financial',
    generatedDate: '2026-03-01',
    size: '1.2 MB'
  };

  beforeEach(async () => {
    adminServiceSpy = jasmine.createSpyObj('AdminService', ['downloadReportFile']);

    await TestBed.configureTestingModule({
      imports: [ReportCard],
      providers: [
        provideRouter([]),
        { provide: AdminService, useValue: adminServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportCard);
    component = fixture.componentInstance;
    component.report = mockReport;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(component.isDownloading).toBeFalse();
  });

  describe('downloadReport', () => {
    it('should call downloadReportFile and trigger file download on success', () => {
      const mockBlob = new Blob(['test data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      adminServiceSpy.downloadReportFile.and.returnValue(of(mockBlob));

      spyOn(window.URL, 'createObjectURL').and.returnValue('blob:http://localhost/test-blob');
      spyOn(window.URL, 'revokeObjectURL');

      const mockAnchor = document.createElement('a');
      spyOn(document, 'createElement').and.callFake((tagName: string) => {
        if (tagName === 'a') return mockAnchor;
        return document.createElement(tagName);
      });
      spyOn(mockAnchor, 'click');

      component.downloadReport();

      expect(adminServiceSpy.downloadReportFile).toHaveBeenCalledWith('rep-1');
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(mockAnchor.download).toBe('financial_quarterly_report.xlsx');
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/test-blob');
      expect(component.isDownloading).toBeFalse();
    });

    it('should handle download failure gracefully', () => {
      adminServiceSpy.downloadReportFile.and.returnValue(throwError(() => new Error('Download failed')));
      spyOn(console, 'error');

      component.downloadReport();

      expect(adminServiceSpy.downloadReportFile).toHaveBeenCalledWith('rep-1');
      expect(console.error).toHaveBeenCalled();
      expect(component.isDownloading).toBeFalse();
    });
  });
});
