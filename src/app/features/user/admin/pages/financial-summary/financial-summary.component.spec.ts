import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminFinancialSummaryComponent } from './financial-summary.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AdminService } from '../../../../../core/services/admin.service';
import { of } from 'rxjs';

describe('AdminFinancialSummaryComponent', () => {
  let component: AdminFinancialSummaryComponent;
  let fixture: ComponentFixture<AdminFinancialSummaryComponent>;
  let mockAdminService: any;

  beforeEach(async () => {
    mockAdminService = {
      getFinancialStats: jasmine.createSpy('getFinancialStats').and.returnValue(of({
        totalVolume: 5000,
        platformCommissions: 500,
        escrowHeld: 1000,
        growthPercent: 10
      })),
      getTransactions: jasmine.createSpy('getTransactions').and.returnValue(of([
        { id: '1', clientName: 'Alice', freelancerName: 'Bob', contractTitle: 'UI Design', status: 'Completed', budget: 100 }
      ]))
    };

    await TestBed.configureTestingModule({
      imports: [AdminFinancialSummaryComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AdminService, useValue: mockAdminService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminFinancialSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load financials on init', () => {
    expect(mockAdminService.getFinancialStats).toHaveBeenCalled();
    expect(mockAdminService.getTransactions).toHaveBeenCalled();
    expect(component.financialStats().totalVolume).toBe(5000);
    expect(component.transactions().length).toBe(1);
  });

  it('should filter transactions based on search term', () => {
    component.transactions.set([
      { id: '1', clientName: 'Alice', freelancerName: 'Bob', contractTitle: 'UI Design', status: 'Completed', budget: 100 },
      { id: '2', clientName: 'Charlie', freelancerName: 'Dave', contractTitle: 'Backend Api', status: 'Pending', budget: 200 }
    ] as any);
    
    component.searchTerm.set('Backend');
    const filtered = component.filteredTransactions();
    expect(filtered.length).toBe(1);
    expect(filtered[0].freelancerName).toBe('Dave');
  });
});
