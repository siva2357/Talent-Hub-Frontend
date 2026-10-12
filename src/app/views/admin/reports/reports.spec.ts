import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Reports } from './reports';
import { AdminService } from '../../../core/services/admin.service';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Reports', () => {
  let component: Reports;
  let fixture: ComponentFixture<Reports>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  const mockReports = [
    { id: 'r1', title: 'Q1 Audit Report', description: 'Financial audit for Q1', type: 'Audit' },
    { id: 'r2', title: 'Platform Analytics', description: 'User traffic and retention', type: 'Analytics' },
    { id: 'r3', title: 'Revenue Overview', description: 'Total transaction fee summary', type: 'Financial' }
  ];

  beforeEach(async () => {
    adminServiceSpy = jasmine.createSpyObj('AdminService', ['getReports']);
    adminServiceSpy.getReports.and.returnValue(of({ success: true, reports: structuredClone(mockReports) }));

    await TestBed.configureTestingModule({
      imports: [Reports],
      providers: [
        { provide: AdminService, useValue: adminServiceSpy },
        DatePipe,
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Reports);
    component = fixture.componentInstance;
  });

  it('should create and fetch reports on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component).toBeTruthy();
    expect(adminServiceSpy.getReports).toHaveBeenCalled();
    expect(component.rawReports$.value.length).toBe(3);
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle error when fetching reports', fakeAsync(() => {
    adminServiceSpy.getReports.and.returnValue(throwError(() => new Error('Network error')));
    component.fetchReports();
    tick();

    expect(component.isLoading).toBeFalse();
  }));

  it('should filter reports by title/description and type', fakeAsync(() => {
    fixture.detectChanges();
    tick(300);

    let emittedReports: any[] = [];
    component.filteredReports$.subscribe(res => (emittedReports = res));
    tick(300);

    expect(emittedReports.length).toBe(3);

    component.onSearchChange('traffic');
    component.applyFilters();
    tick(300);
    expect(emittedReports.length).toBe(1);
    expect(emittedReports[0].title).toBe('Platform Analytics');

    component.onTypeChange('Financial');
    component.onSearchChange('');
    component.applyFilters();
    tick(300);
    expect(emittedReports.length).toBe(1);
    expect(emittedReports[0].type).toBe('Financial');

    component.resetFilters();
    tick(300);
    expect(emittedReports.length).toBe(3);
  }));

  it('should remove filter criteria properly', fakeAsync(() => {
    fixture.detectChanges();
    tick(300);

    component.onSearchChange('Audit');
    component.onTypeChange('Audit');
    component.applyFilters();
    tick(300);

    expect(component.activeFilters.length).toBe(2);

    component.removeFilter({ key: 'search' });
    tick(300);
    expect(component.localSearchTerm).toBe('');

    component.removeFilter({ key: 'type' });
    tick(300);
    expect(component.localTypeFilter).toBe('');
  }));
});
